import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Toast from '../UI/Toast';
import { createInAppNotification } from '../../utils/emailNotifications';

const ChatNotificationListener = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [notification, setNotification] = useState(null);
  const [currentUserDbId, setCurrentUserDbId] = useState(null);

  // Obtener ID de usuario de base de datos
  useEffect(() => {
    const fetchUserDbId = async () => {
      if (!user?.email) return;
      
      try {
        const { data, error } = await supabase
          .from('Users')
          .select('id')
          .eq('email', user.email)
          .single();
          
        if (data) {
          setCurrentUserDbId(data.id);
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    if (user) {
      fetchUserDbId();
    }
  }, [user]);

  const getSavedSearchStorageKey = () => {
    if (!user?.email) return null;
    return `resmoke:savedSearches:${user.email.toLowerCase().trim()}`;
  };

  const loadSavedSearches = () => {
    const storageKey = getSavedSearchStorageKey();
    if (!storageKey) return [];
    try {
      const raw = localStorage.getItem(storageKey);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const persistSavedSearches = (items) => {
    const storageKey = getSavedSearchStorageKey();
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(items));
  };

  const sanitizeSearchTerm = (value) => {
    return String(value || '')
      .trim()
      .slice(0, 80)
      .replace(/[%]/g, '')
      .replace(/[,]/g, ' ');
  };

  const buildProductsQuery = (criteria) => {
    const categoryId = criteria?.categoryId || null;
    const q = sanitizeSearchTerm(criteria?.searchQuery || '');
    const minPrice = criteria?.filters?.minPrice;
    const maxPrice = criteria?.filters?.maxPrice;
    const locationFilter = sanitizeSearchTerm(criteria?.filters?.location || '');

    let query = supabase
      .from('products')
      .select('id,name,description,price,created_at,updated_at,category_id,status')
      .eq('status', 'available');

    if (categoryId) query = query.eq('category_id', categoryId);
    if (minPrice !== '' && minPrice !== null && minPrice !== undefined) query = query.gte('price', Number(minPrice) || 0);
    if (maxPrice !== '' && maxPrice !== null && maxPrice !== undefined) query = query.lte('price', Number(maxPrice) || 0);
    if (locationFilter) query = query.ilike('location', `%${locationFilter}%`);
    if (q) query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);

    return query;
  };

  const runSavedSearchAlerts = async () => {
    if (!currentUserDbId || !user?.email) return;
    const searches = loadSavedSearches();
    if (!searches.length) return;

    const nowIso = new Date().toISOString();
    const next = [...searches];

    for (let i = 0; i < next.length; i += 1) {
      const s = next[i];
      const criteria = s?.criteria || {};
      const notifyNew = Boolean(s?.notifyNewProducts);
      const notifyDrop = Boolean(s?.notifyPriceDrops);
      const lastCheckedAt = s?.lastCheckedAt || nowIso;
      const seenSet = new Set(Array.isArray(s?.seenProductIds) ? s.seenProductIds : []);
      const lastPrices = s?.lastPrices && typeof s.lastPrices === 'object' ? s.lastPrices : {};

      let newNotifs = 0;
      let dropNotifs = 0;

      if (notifyNew) {
        const { data: products } = await buildProductsQuery(criteria)
          .gt('created_at', lastCheckedAt)
          .order('created_at', { ascending: false })
          .limit(10);

        const candidates = Array.isArray(products) ? products : [];
        for (const p of candidates) {
          if (newNotifs >= 3) break;
          if (!p?.id || seenSet.has(p.id)) continue;
          const price = Number(p.price) || 0;
          const ok = await createInAppNotification({
            receiverId: currentUserDbId,
            title: 'Nuevo producto',
            message: `${p.name || 'Producto'} · ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price)}`,
            linkUrl: `/product/${p.id}`,
            type: 'saved_search_new_product',
            metadata: { product_id: p.id, saved_search_id: s.id }
          });
          if (ok) {
            newNotifs += 1;
            seenSet.add(p.id);
            lastPrices[p.id] = price;
          }
        }
      }

      if (notifyDrop) {
        const { data: products } = await buildProductsQuery(criteria)
          .gt('updated_at', lastCheckedAt)
          .order('updated_at', { ascending: false })
          .limit(30);

        const candidates = Array.isArray(products) ? products : [];
        for (const p of candidates) {
          if (dropNotifs >= 3) break;
          if (!p?.id) continue;
          const price = Number(p.price) || 0;
          const previous = Number(lastPrices[p.id]);
          if (!Number.isFinite(previous) || previous <= 0) {
            lastPrices[p.id] = price;
            continue;
          }
          if (price > 0 && price < previous) {
            const ok = await createInAppNotification({
              receiverId: currentUserDbId,
              title: 'Bajada de precio',
              message: `${p.name || 'Producto'} · ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(previous)} → ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price)}`,
              linkUrl: `/product/${p.id}`,
              type: 'saved_search_price_drop',
              metadata: { product_id: p.id, saved_search_id: s.id, previous_price: previous, new_price: price }
            });
            if (ok) {
              dropNotifs += 1;
              seenSet.add(p.id);
              lastPrices[p.id] = price;
            }
          } else {
            lastPrices[p.id] = price;
          }
        }
      }

      next[i] = {
        ...s,
        lastCheckedAt: nowIso,
        seenProductIds: Array.from(seenSet).slice(0, 1000),
        lastPrices
      };
    }

    persistSavedSearches(next);
  };

  useEffect(() => {
    if (!currentUserDbId || !user?.email) return;
    runSavedSearchAlerts();
    const interval = setInterval(() => {
      runSavedSearchAlerts();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [currentUserDbId, user?.email]);

  // Sonido de notificación
  const playNotificationSound = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'); // Sonido suave de notificación
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Audio autoplay prevented:', e));
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  useEffect(() => {
    if (!currentUserDbId) return;

    const channel = supabase
      .channel('global_messages_listener')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, async (payload) => {
        const newMessage = payload.new;

        // 1. Ignorar mis propios mensajes
        if (newMessage.sender_id === currentUserDbId) return;

        // 2. Ignorar si ya estoy viendo esta conversación
        if (location.pathname.includes(`/chat/${newMessage.conversation_id}`)) return;

        // 3. Verificar si el mensaje es para mí (si RLS no filtra, o para estar seguros)
        // Obtenemos la conversación para ver participantes
        const { data: conversation } = await supabase
          .from('conversations')
          .select('buyer_id, seller_id, products(name)')
          .eq('id', newMessage.conversation_id)
          .single();

        if (conversation) {
          const isParticipant = conversation.buyer_id === currentUserDbId || conversation.seller_id === currentUserDbId;
          
          if (isParticipant) {
            // Es para mí!
            playNotificationSound();
            
            // Intentar obtener nombre del remitente
            const { data: sender } = await supabase
              .from('Users')
              .select('nombre')
              .eq('id', newMessage.sender_id)
              .single();

            const senderName = sender?.nombre || 'Usuario';
            const productName = conversation.products?.name ? ` · ${conversation.products.name}` : '';
            
            setNotification({
              message: `Nuevo mensaje de ${senderName}${productName}: "${newMessage.message.substring(0, 30)}${newMessage.message.length > 30 ? '...' : ''}"`,
              type: 'message'
            });
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserDbId, location.pathname]);

  return (
    <Toast 
      message={notification?.message} 
      isVisible={!!notification} 
      onClose={() => setNotification(null)}
      type="message"
      duration={4000}
    />
  );
};

export default ChatNotificationListener;
