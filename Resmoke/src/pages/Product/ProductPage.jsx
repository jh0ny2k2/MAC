import React, { useState, useEffect, useRef } from 'react';
import { Settings, MessageSquare, Wallet, ShoppingCart, User as UserIcon } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Layout/HeaderProducts';
import Footer from '../../components/Layout/Footer';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { AdSidebar, AdRectangle, AdMobile } from '../../components/Ads';
import LazyAdBanner from '../../components/Ads/LazyAdBanner';
import { adsenseConfig } from '../../config/googleAdsense';
import useAnalytics from '../../hooks/useAnalytics';
import SEO from '../../components/SEO/SEO';
import ShareButton from '../../components/ShareButton/ShareButton';
import { generateProductStructuredData } from '../../utils/structuredData';

// Fix para los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [imageModal, setImageModal] = useState({ isOpen: false, imageUrl: '', imageAlt: '' });
  const [mapLocation, setMapLocation] = useState({ lat: -12.0464, lng: -77.0428 });
  const [currentUserDbId, setCurrentUserDbId] = useState(null);
  const [sellerData, setSellerData] = useState(null);
  const [copyOk, setCopyOk] = useState(false);
  
  // ✅ AGREGAR REF PARA CONTROLAR SI YA SE INCREMENTÓ
  const viewCountIncremented = useRef(false);
  
  // ✅ NUEVOS ESTADOS PARA PRODUCTOS RELACIONADOS
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  
  // Estados existentes para venta
  const [showSoldModal, setShowSoldModal] = useState(false);
  const [soldLoading, setSoldLoading] = useState(false);
  
  const [buyerInfo, setBuyerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  const [salePrice, setSalePrice] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showUserSearch, setShowUserSearch] = useState(true);
  
  // ✅ NUEVOS ESTADOS PARA RESERVA
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [reserveLoading, setReserveLoading] = useState(false);
  const [reserveNote, setReserveNote] = useState('');
  
  // ✅ NUEVO ESTADO PARA MODAL DE CONFIRMACIÓN DE VENTA SIMPLE
  const [showConfirmSaleModal, setShowConfirmSaleModal] = useState(false);
  
  // ✅ NUEVO ESTADO PARA MODAL DE CONFIRMACIÓN DE OCULTAR PRODUCTO
  const [showHideModal, setShowHideModal] = useState(false);
  
  // ✅ NUEVOS ESTADOS PARA RESERVA CON USUARIO
  const [reserveSearchQuery, setReserveSearchQuery] = useState('');
  const [reserveSearchResults, setReserveSearchResults] = useState([]);
  const [selectedReserver, setSelectedReserver] = useState(null);
  
  // Analytics hook
  const { trackEvent, trackProductView, trackAddToFavorites, trackShare, trackPurchase, trackButtonClick } = useAnalytics();
  const [isReserveSearching, setIsReserveSearching] = useState(false);
  const [showReserveUserSearch, setShowReserveUserSearch] = useState(true);
  const [reserverInfo, setReserverInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  // ✅ NUEVOS ESTADOS PARA MODAL DE CHAT
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  
  // ✅ NUEVOS ESTADOS PARA MODAL DE CONTRAOFERTA
  const [showCounterOfferModal, setShowCounterOfferModal] = useState(false);
  const [counterOfferData, setCounterOfferData] = useState({
    amount: '',
    message: ''
  });
  const [counterOfferLoading, setCounterOfferLoading] = useState(false);

  // ✅ NUEVOS ESTADOS PARA MODAL DE COMPRA
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [sellerAvgRating, setSellerAvgRating] = useState(0);
  const [sellerReviewCount, setSellerReviewCount] = useState(0);
  const [latestSellerReviews, setLatestSellerReviews] = useState([]);
  
  // Función para obtener URL pública de Supabase Storage
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/img/resmoke/noFoto.png';
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(imagePath);
    
    return data.publicUrl;
  };

  // ✅ FUNCIÓN PARA OBTENER URL DE IMAGEN PARA PRODUCTOS RELACIONADOS
  const getRelatedImageUrl = (imagePath) => {
    if (!imagePath) return '/img/resmoke/noFoto.png';
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(imagePath);
    
    return data.publicUrl;
  };

  const getCardImageUrl = (p) => {
    const candidates = [p?.main_image, p?.extra_image_1, p?.extra_image_2, p?.extra_image_3, p?.extra_image_4].filter(Boolean);
    const first = candidates[0] || null;
    return getImageUrl(first);
  };

  const getRandomSample = (arr, count) => {
    if (!arr || arr.length === 0) return [];
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, count);
  };

  // ✅ FUNCIÓN ALTERNATIVA CON LOCALSTORAGE
  const incrementViewCount = async () => {
    const viewKey = `product_view_${productId}_${Date.now().toString().slice(0, -5)}`; // Cambia cada ~3 minutos
    
    // Verificar si ya se incrementó recientemente
    if (localStorage.getItem(viewKey)) {
      return;
    }
    
    try {
      // Marcar como visto
      localStorage.setItem(viewKey, 'true');
      
      const { error } = await supabase
        .rpc('increment_view_count', {
          product_id_param: parseInt(productId)
        });
      
      if (error) {
        console.error('Error incrementing view count:', error);
        // Si hay error, quitar la marca
        localStorage.removeItem(viewKey);
      }
    } catch (error) {
      console.error('Error incrementing view count:', error);
      localStorage.removeItem(viewKey);
    }
  };

  // ✅ FUNCIÓN MEJORADA PARA OBTENER PRODUCTO
  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (id, name),
          Users!products_user_id_fkey (id, nombre, email, telefono, is_verified)
        `)
        .eq('id', productId)
        .single();
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      setProduct(data);
      setCategory(data.categories);
      setSellerData(data.Users);
      
      // ✅ INCREMENTAR CONTADOR SOLO UNA VEZ
      await incrementViewCount();
      
      // Track product view for analytics
      trackProductView(data.id, data.name, data.categories?.name, data.price);
      if (!viewCountIncremented.current) {
        viewCountIncremented.current = true;
        trackEvent('funnel_visit', {
          product_id: data.id,
          product_name: data.name,
          product_category: data.categories?.name || null,
          price: data.price || 0
        });
      }
      
      // Si el producto tiene una dirección, obtener coordenadas
      if (data.location || data.address) {
        const coords = await getCoordinatesFromAddress(data.location || data.address);
        if (coords) {
          setMapLocation(coords);
        }
      }
    } catch (error) {
      console.error('Error al obtener producto:', error);
      setError('Error al cargar el producto');
    }
  };

  const fetchSellerReputation = async () => {
    try {
      const sellerId = sellerData?.id || product?.user_id;
      if (!sellerId) return;
      const { data: ratings, error: ratingsError } = await supabase
        .from('reviews')
        .select('rating')
        .eq('seller_id', sellerId);
      if (!ratingsError && ratings) {
        const count = ratings.length;
        const sum = ratings.reduce((s, r) => s + (r.rating || 0), 0);
        const avg = count ? (sum / count) : 0;
        setSellerAvgRating(parseFloat(avg.toFixed(1)));
        setSellerReviewCount(count);
      }
      const { data: latest, error: latestError } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          image_url,
          created_at,
          buyer:buyer_id (id, nombre)
        `)
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false })
        .limit(3);
      if (!latestError) {
        setLatestSellerReviews(latest || []);
      }
    } catch (e) {
    }
  };

  useEffect(() => {
    if (sellerData?.id || product?.user_id) {
      fetchSellerReputation();
    }
  }, [sellerData?.id, product?.user_id]);

  // Función para obtener datos del vendedor
  const fetchSellerData = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('Users')
        .select('id, nombre, email, telefono, is_verified')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error obteniendo datos del vendedor:', error);
        return;
      }
      
      setSellerData(data);
    } catch (error) {
      console.error('Error obteniendo datos del vendedor:', error);
    }
  };

  // ✅ Función para buscar usuarios registrados
  const searchUsers = async (query) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('Users')
        .select('id, nombre, email, telefono')
        .or(`nombre.ilike.%${query}%,email.ilike.%${query}%`)
        .limit(10);
      
      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error buscando usuarios:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  
  // ✅ Función para seleccionar un usuario como comprador
  const selectBuyer = (user) => {
    setSelectedBuyer(user);
    setBuyerInfo({
      name: user.nombre,
      email: user.email,
      phone: user.telefono || ''
    });
    setSearchQuery('');
    setSearchResults([]);
  };
  
  // ✅ FUNCIÓN PARA BUSCAR USUARIOS PARA RESERVA
  const searchUsersForReserve = async (query) => {
    if (!query.trim()) {
      setReserveSearchResults([]);
      return;
    }

    setIsReserveSearching(true);
    try {
      const { data, error } = await supabase
        .from('Users')
        .select('id, nombre, email, telefono')
        .or(`nombre.ilike.%${query}%,email.ilike.%${query}%`)
        .limit(10);

      if (error) throw error;
      setReserveSearchResults(data || []);
    } catch (error) {
      console.error('Error buscando usuarios para reserva:', error);
      setReserveSearchResults([]);
    } finally {
      setIsReserveSearching(false);
    }
  };

  // ✅ FUNCIÓN PARA SELECCIONAR USUARIO PARA RESERVA
  const selectReserverUser = (user) => {
    setSelectedReserver(user);
    setReserveSearchQuery(user.nombre);
    setReserveSearchResults([]);
  };

  // ✅ FUNCIÓN PARA OBTENER PRODUCTOS RELACIONADOS
  const fetchRelatedProducts = async () => {
    if (!product) return;
    setRelatedLoading(true);
    try {
      const { data: sameCategory, error: sameError } = await supabase
        .from('products')
        .select(`*, categories (id, name)`) 
        .eq('status', 'available')
        .eq('category_id', product.category_id)
        .neq('id', product.id)
        .limit(50);
      if (sameError) {
        console.error('Error al obtener productos de la misma categoría:', sameError);
      }
      let pool = sameCategory || [];
      if (pool.length < 4) {
        const { data: others, error: otherError } = await supabase
          .from('products')
          .select(`*, categories (id, name)`) 
          .eq('status', 'available')
          .neq('category_id', product.category_id)
          .neq('id', product.id)
          .limit(50);
        if (otherError) {
          console.error('Error al obtener productos de otras categorías:', otherError);
        }
        pool = [...pool, ...(others || [])];
      }
      const sample = getRandomSample(pool, 4);
      setRelatedProducts(sample);
    } catch (error) {
      console.error('Error al obtener productos relacionados:', error);
    } finally {
      setRelatedLoading(false);
    }
  };

  // ✅ FUNCIÓN PARA LIMPIAR SELECCIÓN DE RESERVA
  const clearReserverSelection = () => {
    setSelectedReserver(null);
    setReserveSearchQuery('');
    setReserveSearchResults([]);
  };
  
  // ✅ FUNCIÓN PARA RESERVAR PRODUCTO MEJORADA
  const reserveProduct = async () => {
    if (!user || !currentUserDbId) {
      alert('Debes iniciar sesión para reservar un producto');
      return;
    }

    // Validar que se haya seleccionado un usuario o ingresado info manual
    if (showReserveUserSearch && !selectedReserver) {
      alert('Por favor selecciona un usuario para la reserva');
      return;
    }

    if (!showReserveUserSearch && (!reserverInfo.name || !reserverInfo.email)) {
      alert('Por favor completa al menos el nombre y email');
      return;
    }

    setReserveLoading(true);
    try {
      const updateData = {
        status: 'reserved',
        reserved_by: currentUserDbId,
        reserved_date: new Date().toISOString(),
        reserve_note: reserveNote || null
      };

      // Si se seleccionó un usuario registrado
      if (showReserveUserSearch && selectedReserver) {
        updateData.reserver_user_id = selectedReserver.id;
        updateData.reserver_name = selectedReserver.nombre;
        updateData.reserver_email = selectedReserver.email;
        updateData.reserver_phone = selectedReserver.telefono;
      } else {
        // Si se ingresó manualmente
        updateData.reserver_name = reserverInfo.name;
        updateData.reserver_email = reserverInfo.email;
        updateData.reserver_phone = reserverInfo.phone;
      }

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', productId);
      
      if (error) throw error;
      
      // Actualizar el estado local
      setProduct(prev => ({ ...prev, ...updateData }));
      trackEvent('funnel_reserve', {
        product_id: parseInt(productId),
        reserved_by: currentUserDbId,
        reserver_user_id: selectedReserver?.id || null
      });
      
      // Limpiar estados
      setShowReserveModal(false);
      setReserveNote('');
      setSelectedReserver(null);
      setReserveSearchQuery('');
      setReserverInfo({ name: '', email: '', phone: '' });
      
      alert('¡Producto reservado exitosamente!');
    } catch (error) {
      console.error('Error al reservar producto:', error);
      alert('Error al reservar el producto. Por favor, inténtalo de nuevo.');
    } finally {
      setReserveLoading(false);
    }
  };
  
  // ✅ FUNCIÓN MODIFICADA PARA INICIAR CHAT CON LÓGICA RESPONSIVA
  const startChat = async () => {
    if (!user || !currentUserDbId) {
      alert('Debes iniciar sesión para contactar al vendedor');
      navigate('/login');
      return;
    }

    if (isProductOwner) {
      alert('No puedes chatear contigo mismo');
      return;
    }

    try {
      // Verificar si ya existe una conversación
      const { data: existingConversation, error: searchError } = await supabase
        .from('conversations')
        .select('id')
        .eq('product_id', productId)
        .eq('buyer_id', currentUserDbId)
        .eq('seller_id', product.user_id)
        .single();

      if (searchError && searchError.code !== 'PGRST116') {
        throw searchError;
      }

      let conversationId;
      
      if (existingConversation) {
        conversationId = existingConversation.id;
      } else {
        // Crear nueva conversación
        const { data: newConversation, error: createError } = await supabase
          .from('conversations')
          .insert({
            product_id: parseInt(productId),
            buyer_id: currentUserDbId,
            seller_id: product.user_id
          })
          .select()
          .single();

        if (createError) throw createError;
        conversationId = newConversation.id;
      }

      trackEvent('funnel_chat', {
        product_id: parseInt(productId),
        conversation_id: conversationId
      });

      // ✅ LÓGICA RESPONSIVA: Modal en desktop, navegación en móvil
      if (window.innerWidth < 768) {
        // En móvil, navegar a la página completa
        navigate(`/chat/${conversationId}`);
      } else {
        // En desktop, abrir modal
        setSelectedConversation({
          id: conversationId,
          otherUser: sellerData,
          product: product
        });
        setIsChatModalOpen(true);
      }
    } catch (error) {
      console.error('Error iniciando chat:', error);
      alert('Error al iniciar el chat. Por favor, inténtalo de nuevo.');
    }
  };

  // ✅ FUNCIONES PARA EL MODAL DE CHAT
  const fetchChatMessages = async (conversationId) => {
    if (!conversationId) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error cargando mensajes:', error);
    }
  };

  const sendChatMessage = async (textOverride) => {
    const outgoing = typeof textOverride === 'string' ? textOverride : newMessage;
    if (!outgoing.trim() || !currentUserDbId || !selectedConversation?.id) return;

    try {
      setChatLoading(true);
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversation.id,
          sender_id: currentUserDbId,
          message: outgoing.trim(),
          is_read: false
        });

      if (error) throw error;

      // Actualizar timestamp de conversación
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', selectedConversation.id);

      try {
        const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
        const emailEndpoint = isLocal ? 'http://localhost:3001/api/email/send' : '/.netlify/functions/email-send';
        const recipientEmail = selectedConversation?.otherUser?.email || null;
        const origin = window.location.origin;
        const conversationUrl = `${origin}/chat/${selectedConversation.id}`;
        if (recipientEmail) {
          await fetch(emailEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: [recipientEmail],
              template: 'unread_message_notification',
              subject: selectedConversation?.product?.name ? `Nuevo mensaje · ${selectedConversation.product.name}` : 'Nuevo mensaje',
              props: {
                productName: selectedConversation?.product?.name || '',
                senderName: user?.nombre || '',
                senderEmail: user?.email || '',
                messagePreview: outgoing.trim().slice(0, 140),
                uploaderEmail: user?.email || '',
                conversationUrl
              }
            })
          });
        }
      } catch (e) {
      }

      setNewMessage('');
      await fetchChatMessages(selectedConversation.id);
    } catch (error) {
      console.error('Error enviando mensaje:', error);
    } finally {
      setChatLoading(false);
    }
  };

  const formatChatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // ✅ Función modificada para marcar como vendido
  const markAsSold = async () => {
    // Validar que se haya seleccionado un comprador o ingresado manualmente
    if (showUserSearch && !selectedBuyer) {
      alert('Por favor, selecciona un usuario registrado como comprador');
      return;
    }
    
    if (!showUserSearch && !buyerInfo.name.trim()) {
      alert('Por favor, ingresa el nombre del comprador');
      return;
    }
  
    setSoldLoading(true);
    try {
      const updateData = {
        status: 'sold',
        sold_date: new Date().toISOString(),
        buyer_name: buyerInfo.name,
        buyer_email: buyerInfo.email || null,
        buyer_phone: buyerInfo.phone || null,
        sale_price: salePrice ? parseFloat(salePrice) : null
      };
      
      // Si se seleccionó un usuario registrado, guardar su ID
      if (selectedBuyer) {
        updateData.buyer_user_id = selectedBuyer.id;
      }
      
      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', productId);
      
      if (error) throw error;
      
      setProduct(prev => ({ 
        ...prev, 
        ...updateData
      }));
      
      setShowDropdown(false);
      setShowSoldModal(false);
      trackEvent('funnel_sale', {
        product_id: parseInt(productId),
        sale_price: updateData.sale_price || null,
        sale_type: 'manual'
      });
      
      // Limpiar el formulario
      setBuyerInfo({ name: '', email: '', phone: '' });
      setSalePrice('');
      setSelectedBuyer(null);
      setSearchQuery('');
      setSearchResults([]);
      
      alert(`¡Felicitaciones! Tu producto ha sido vendido a ${buyerInfo.name} 🎉`);
    } catch (error) {
      console.error('Error al marcar como vendido:', error);
      alert('Error al marcar el producto como vendido. Por favor, inténtalo de nuevo.');
    } finally {
      setSoldLoading(false);
    }
  };

  // Función para confirmar venta al usuario reservado
  const confirmSaleToReserver = async () => {
    if (!product?.reserver_name) {
      alert('No hay un usuario reservado para este producto');
      return;
    }

    setSoldLoading(true);
    try {
      const updateData = {
        status: 'sold',
        sold_date: new Date().toISOString(),
        buyer_name: product.reserver_name,
        buyer_email: product.reserver_email || null,
        buyer_phone: product.reserver_phone || null,
        buyer_user_id: product.reserver_user_id || null,
        sale_price: product.price // Usar el precio original del producto
      };
      
      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', productId);
      
      if (error) throw error;
      
      setProduct(prev => ({ 
        ...prev, 
        ...updateData
      }));
      
      setShowDropdown(false);
      setShowConfirmSaleModal(false);
      trackEvent('funnel_sale', {
        product_id: parseInt(productId),
        sale_price: updateData.sale_price || null,
        sale_type: 'reserved_confirm'
      });
      
      alert(`¡Felicitaciones! Tu producto ha sido vendido a ${product.reserver_name} 🎉`);
    } catch (error) {
      console.error('Error al confirmar venta:', error);
      alert('Error al confirmar la venta. Por favor, inténtalo de nuevo.');
    } finally {
      setSoldLoading(false);
    }
  };

  // Función para actualizar el estado del producto
  const updateProductStatus = async (newStatus) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: newStatus })
        .eq('id', productId);
      
      if (error) throw error;
      
      setProduct(prev => ({ ...prev, status: newStatus }));
      setShowDropdown(false);
      alert(`Producto marcado como ${newStatus}`);
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      alert('Error al actualizar el estado del producto');
    }
  };

  // Función para eliminar producto mejorada
  const deleteProduct = async () => {
    setLoading(true);
    try {
      // Primero eliminar las imágenes del storage
      const imagesToDelete = [];
      
      // Agregar imagen principal si existe
      if (product.main_image && !product.main_image.startsWith('http')) {
        imagesToDelete.push(product.main_image);
      }
      
      // Agregar imágenes adicionales si existen
      if (product.extra_images && Array.isArray(product.extra_images)) {
        product.extra_images.forEach(image => {
          if (image && !image.startsWith('http')) {
            imagesToDelete.push(image);
          }
        });
      }
      
      // Eliminar imágenes del storage
      if (imagesToDelete.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('product-images')
          .remove(imagesToDelete);
        
        if (storageError) {
          console.warn('Error al eliminar algunas imágenes:', storageError);
          // No detenemos el proceso por errores de storage
        }
      }
      
      // Eliminar el producto de la base de datos
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) throw error;
      
      // Mostrar mensaje de éxito
      alert('Producto eliminado exitosamente');
      navigate('/my-products');
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('Error al eliminar el producto. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  // Función para verificar si el producto está en favoritos
  const checkIfFavorite = async () => {
    if (!user || !productId) return;
    
    try {
      // Obtener el usuario de la tabla Users
      const { data: userData, error: userError } = await supabase
        .from('Users')
        .select('id')
        .eq('email', user.email)
        .single();

      if (userError) throw userError;

      // Verificar si existe el favorito
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userData.id)
        .eq('product_id', productId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Error checking favorite:', error);
        return;
      }

      setIsFavorite(!!data);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  // Función para actualizar contador de favoritos
  const updateFavoriteCount = async (increment = true) => {
    try {
      const functionName = increment ? 'increment_favorite_count' : 'decrement_favorite_count';
      const { error } = await supabase
        .rpc(functionName, {
          product_id_param: parseInt(productId)
        });
      
      if (error) {
        console.error('Error updating favorite count:', error);
      }
    } catch (error) {
      console.error('Error updating favorite count:', error);
    }
  };

  // Función para agregar/quitar de favoritos
  const toggleFavorite = async () => {
    if (!user || favoriteLoading) return;
    
    setFavoriteLoading(true);
    
    try {
      // Obtener el usuario de la tabla Users
      const { data: userData, error: userError } = await supabase
        .from('Users')
        .select('id')
        .eq('email', user.email)
        .single();

      if (userError) throw userError;

      if (isFavorite) {
        // Quitar de favoritos
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userData.id)
          .eq('product_id', productId);

        if (error) throw error;
        
        // Decrementar contador de favoritos
        await updateFavoriteCount(false);
        
        setIsFavorite(false);
      } else {
        // Agregar a favoritos
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: userData.id,
            product_id: parseInt(productId)
          });

        if (error) throw error;
        
        // Incrementar contador de favoritos
        await updateFavoriteCount(true);
        
        // Track add to favorites
        trackAddToFavorites(productId, product?.name, product?.categories?.name, product?.price);
        
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Error al actualizar favoritos');
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const scrollToSellerInfo = () => {
    const el = document.getElementById('seller-info');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      openModal();
    }
  };

  const scrollToSection = (id, fallback) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (typeof fallback === 'function') {
      fallback();
    }
  };

  // Funciones para el modal de imágenes
  const openImageModal = (imageUrl, imageAlt) => {
    setImageModal({ isOpen: true, imageUrl, imageAlt });
  };

  const closeImageModal = () => {
    setImageModal({ isOpen: false, imageUrl: '', imageAlt: '' });
  };

  // ✅ FUNCIONES PARA CONTRAOFERTA
  const openCounterOfferModal = () => {
    setShowCounterOfferModal(true);
  };

  const closeCounterOfferModal = () => {
    setShowCounterOfferModal(false);
    setCounterOfferData({
      amount: '',
      message: ''
    });
  };

  const handleCounterOfferSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !currentUserDbId) {
      alert('Debes iniciar sesión para realizar una contraoferta');
      return;
    }

    if (!counterOfferData.amount) {
      alert('Por favor ingresa el monto de la contraoferta');
      return;
    }

    setCounterOfferLoading(true);

    try {
      // ✅ GUARDAR CONTRAOFERTA EN LA BASE DE DATOS (SOLO ESTO)
      const { data: counterOffer, error: counterOfferError } = await supabase
        .from('counter_offers')
        .insert({
          product_id: parseInt(productId),
          sender_id: currentUserDbId,
          receiver_id: product.user_id,
          amount: parseFloat(counterOfferData.amount),
          message: counterOfferData.message || null,
          status: 'pending',
          is_read: false
        })
        .select()
        .single();

      if (counterOfferError) throw counterOfferError;

      try {
        const { data: sellerData } = await supabase
          .from('Users')
          .select('email, nombre')
          .eq('id', product.user_id)
          .single();
        const sellerEmail = sellerData?.email || null;
        const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
        const emailEndpoint = isLocal ? 'http://localhost:3001/api/email/send' : '/.netlify/functions/email-send';
        const origin = window.location.origin;
        const productUrl = `${origin}/product/${productId}`;
        if (sellerEmail) {
          await fetch(emailEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: [sellerEmail],
              template: 'counter_offer_received',
              subject: `Nueva contraoferta · ${product.name}`,
              props: {
                productName: product.name,
                amount: parseFloat(counterOfferData.amount).toLocaleString('es-ES'),
                offerMessage: counterOfferData.message || '',
                senderName: user?.nombre || '',
                senderEmail: user?.email || '',
                uploaderEmail: user?.email || '',
                productUrl
              }
            })
          });
        }
      } catch (e) {
      }

      alert('¡Contraoferta enviada exitosamente! El vendedor recibirá una notificación en su campanita.');
      closeCounterOfferModal();
      
    } catch (error) {
      console.error('Error enviando contraoferta:', error);
      alert('Error al enviar la contraoferta. Inténtalo de nuevo.');
    } finally {
      setCounterOfferLoading(false);
    }
  };

  // ✅ FUNCIÓN PARA PROCESAR LA COMPRA
  const handlePurchase = async () => {
    if (!user || !currentUserDbId) {
      alert('Debes iniciar sesión para comprar este producto');
      return;
    }

    // Validar que no sea el propietario
    if (currentUserDbId === product?.user_id) {
      alert('No puedes comprar tu propio producto');
      return;
    }

    // Validar que el producto esté disponible
    if (product?.status !== 'available') {
      alert('Este producto ya no está disponible');
      return;
    }

    setPurchaseLoading(true);

    try {
      // Actualizar el estado del producto a vendido
      const { error: updateError } = await supabase
        .from('products')
        .update({ 
          status: 'sold',
          buyer_user_id: currentUserDbId,
          buyer_name: user.nombre,
          buyer_email: user.email,
          buyer_phone: user.telefono || '',
          sold_date: new Date().toISOString()
        })
        .eq('id', productId);

      if (updateError) throw updateError;

      // Crear o actualizar conversación para notificar al vendedor
      const { data: existingConversation, error: searchError } = await supabase
        .from('conversations')
        .select('id')
        .eq('product_id', productId)
        .eq('buyer_id', currentUserDbId)
        .eq('seller_id', product.user_id)
        .single();

      let conversationId;
      
      if (existingConversation) {
        conversationId = existingConversation.id;
      } else {
        // Crear nueva conversación
        const { data: newConversation, error: createError } = await supabase
          .from('conversations')
          .insert({
            product_id: parseInt(productId),
            buyer_id: currentUserDbId,
            seller_id: product.user_id
          })
          .select()
          .single();

        if (createError) throw createError;
        conversationId = newConversation.id;
      }

      // Crear mensaje de confirmación de compra
      const purchaseMessage = `🎉 **¡PRODUCTO VENDIDO!**\n\n` +
        `┌─────────────────────────────────────┐\n` +
        `│  📦 **PRODUCTO:** ${product.name}\n` +
        `│  💰 **PRECIO:** €${parseFloat(product.price).toLocaleString('es-PE', { minimumFractionDigits: 2 })}\n` +
        `│  👤 **COMPRADOR:** ${user.email}\n` +
        `│  📅 **FECHA:** ${new Date().toLocaleDateString('es-ES')}\n` +
        `└─────────────────────────────────────┘\n\n` +
        `✅ **El producto ha sido marcado como VENDIDO**\n` +
        `📧 **Contacta al comprador para coordinar la entrega**\n\n` +
        `⏰ *${new Date().toLocaleDateString('es-ES')} - ${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}*`;

      // Enviar mensaje de confirmación
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: currentUserDbId,
          message: purchaseMessage,
          is_read: false
        });

      if (messageError) throw messageError;

      // Actualizar timestamp de conversación
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      alert('¡Compra realizada exitosamente! El producto ha sido marcado como vendido.');
      setShowPurchaseModal(false);
      
      // Track purchase for analytics
      trackPurchase(productId, product?.name, product?.categories?.name, product?.price, 1);
      trackEvent('funnel_sale', {
        product_id: parseInt(productId),
        sale_type: 'purchase'
      });
      
      // Actualizar el estado local del producto
      setProduct(prev => ({
        ...prev,
        status: 'sold',
        buyer_id: currentUserDbId,
        buyer_name: user.nombre,
        buyer_email: user.email,
        buyer_phone: user.telefono || '',
        sold_date: new Date().toISOString()
      }));

    } catch (error) {
      console.error('Error procesando la compra:', error);
      alert('Error al procesar la compra. Inténtalo de nuevo.');
    } finally {
      setPurchaseLoading(false);
    }
  };

  // Función para obtener coordenadas desde una dirección
  const getCoordinatesFromAddress = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
      return null;
    } catch (error) {
      console.error('Error al obtener coordenadas:', error);
      return null;
    }
  };

  // Obtener el id del usuario en la tabla Users (no el UUID de auth)
  const fetchCurrentUserDbId = async () => {
    if (!user) return;
    try {
      const { data: userData, error: userError } = await supabase
        .from('Users')
        .select('id')
        .eq('email', user.email)
        .single();

      if (userError) throw userError;
      setCurrentUserDbId(userData.id);
    } catch (error) {
      console.error('Error obteniendo id de usuario actual:', error);
    }
  };

  // Verificar si el usuario es el propietario (comparar contra Users.id)
  const isProductOwner = user && product && currentUserDbId && String(product.user_id) === String(currentUserDbId);

  // ✅ useEffect MEJORADO CON CLEANUP
  useEffect(() => {
    let isMounted = true;
    
    const loadProduct = async () => {
      if (!productId || !isMounted) return;
      
      setLoading(true);
      setError(null);
      
      try {
        await fetchProduct();
        
        if (isMounted) {
          // Obtener ID del usuario actual
          if (user) {
            const { data: userData } = await supabase
              .from('Users')
              .select('id')
              .eq('email', user.email)
              .single();
            
            if (userData && isMounted) {
              setCurrentUserDbId(userData.id);
            }
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error loading product:', error);
          setError('Error al cargar el producto');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    loadProduct();
    
    // ✅ CLEANUP FUNCTION
    return () => {
      isMounted = false;
    };
  }, [productId, user]); // Dependencias específicas
  
  // ✅ useEffect SEPARADO PARA FAVORITOS
  useEffect(() => {
    if (user && productId) {
      checkIfFavorite();
    }
  }, [user, productId]);
  
  // ✅ useEffect SEPARADO PARA PRODUCTOS RELACIONADOS
  useEffect(() => {
    if (product) {
      fetchRelatedProducts();
    }
  }, [product]);

  // ✅ EFECTO PARA MANEJAR EL MODAL DE CHAT
  useEffect(() => {
    if (isChatModalOpen && selectedConversation?.id) {
      fetchChatMessages(selectedConversation.id);

      // Suscripción en tiempo real
      const subscription = supabase
        .channel(`messages-${selectedConversation.id}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedConversation.id}`
        }, () => {
          fetchChatMessages(selectedConversation.id);
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [isChatModalOpen, selectedConversation?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/60">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-gray-900 animate-spin" />
            <p className="text-sm text-gray-400 font-medium tracking-wide">Cargando producto...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50/60">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
            <p className="text-sm text-gray-500 mb-6">{error || 'Producto no encontrado'}</p>
            <button onClick={handleGoBack} className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors">
              Volver atrás
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/60">
      <SEO 
        title={`${product.title} - Resmoke`}
        description={`${product.description.substring(0, 150)}... Precio: $$ ${product.price}. Categoría: ${category?.name || 'Sin categoría'}. Ubicación: ${product.location || 'España'}.`}
        keywords={`${product.title}, ${category?.name || ''}, ${product.brand || ''}, ${product.condition || ''}, comprar, vender, segunda mano, usado, España`}
        image={product.images && product.images.length > 0 ? product.images[0] : '/default-product.jpg'}
        url={`/product/${product.id}`}
        type="product"
        structuredData={generateProductStructuredData({
          id: product.id,
          title: product.title,
          description: product.description,
          main_image: product.main_image,
          images: product.images,
          brand: product.brand,
          category: category?.name,
          price: product.price,
          status: product.status,
          url: `/product/${product.id}`
        })}
      />
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
            {/* ── Imágenes ── */}
            <div className="lg:col-span-7 space-y-3">
              <div className="bg-white rounded-3xl border border-gray-100/80 shadow-sm overflow-hidden group">
                <div className="relative overflow-hidden">
                  <img
                    src={getImageUrl(product.main_image)}
                    alt={product.name}
                    className="w-full h-[420px] sm:h-[540px] lg:h-[600px] object-cover cursor-pointer bg-gray-50 transition duration-700 group-hover:scale-[1.02]"
                    onClick={() => openImageModal(getImageUrl(product.main_image), product.name)}
                    onError={(e) => {
                      e.target.src = '/img/resmoke/noFoto.png';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.02] transition-colors duration-500" />
                </div>
              </div>
              {(product.extra_image_1 || product.extra_image_2 || product.extra_image_3 || product.extra_image_4) && (
                <div className="grid grid-cols-4 gap-2">
                  {[product.extra_image_1, product.extra_image_2, product.extra_image_3, product.extra_image_4].map((img, i) => (
                    img ? (
                      <div key={i} className="bg-white rounded-xl border border-gray-100/80 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition">
                        <img
                          src={img}
                          alt={`Imagen ${i + 2}`}
                          className="w-full h-20 sm:h-24 object-cover bg-gray-50"
                          onClick={() => openImageModal(img, `Imagen ${i + 2}`)}
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    ) : null
                  ))}
                </div>
              )}
            </div>

            {/* ── Info ── */}
            <div className="lg:col-span-5 space-y-5">
              <div className="lg:sticky lg:top-24 space-y-5">
                <div className="bg-white rounded-3xl border border-gray-100/80 shadow-sm p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      {category?.name && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-[11px] font-semibold uppercase tracking-wider mb-3">
                          {category.name}
                        </span>
                      )}
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight tracking-tight">{product.name}</h1>
                      <div className="mt-3 flex items-baseline gap-3">
                        <span className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">€{product.price}</span>
                        {parseInt(product.original_price) > parseInt(product.price) && (
                          <span className="text-base text-gray-400 line-through">€{product.original_price}</span>
                        )}
                      </div>
                    </div>
                    <div className="relative flex-shrink-0">
                      {isProductOwner ? (
                        <button
                          onClick={() => setShowDropdown(!showDropdown)}
                          className="p-2.5 rounded-xl bg-white shadow-sm border border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-all"
                          type="button"
                        >
                          <Settings className="w-4 h-4 text-gray-400" />
                        </button>
                      ) : (
                        <button
                          onClick={toggleFavorite}
                          disabled={favoriteLoading}
                          className={`p-2.5 rounded-xl border transition-all ${isFavorite ? 'border-red-100 bg-red-50 hover:bg-red-100' : 'border-gray-100 bg-white hover:bg-gray-50 hover:border-gray-200'}`}
                        >
                          {favoriteLoading ? (
                            <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
                          ) : (
                            <svg
                              className={`w-4 h-4 transition-colors ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                              fill={isFavorite ? 'currentColor' : 'none'}
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          )}
                        </button>
                      )}
                      {isProductOwner && showDropdown && (
                        <div className="absolute right-0 mt-2 z-50 bg-white rounded-xl shadow-lg border border-gray-100 w-48 py-1">
                          {product.status === 'available' && (
                            <>
                              <div className="px-4 py-2 border-b border-gray-50">
                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Gestionar</p>
                              </div>
                              <button onClick={() => navigate(`/edit-product/${product.id}`)} className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                Editar
                              </button>
                              <button onClick={() => setShowSoldModal(true)} disabled={soldLoading} className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 transition-colors disabled:opacity-50">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>
                                Marcar como Vendido
                              </button>
                              <button onClick={() => setShowReserveModal(true)} className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-yellow-50 transition-colors">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                Reservar
                              </button>
                              <button onClick={() => setShowHideModal(true)} className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                Ocultar
                              </button>
                              <div className="border-t border-gray-50 mt-1 pt-1">
                                <button onClick={() => setShowDeleteModal(true)} className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                  Eliminar
                                </button>
                              </div>
                            </>
                          )}
                          {product.status === 'sold' && (
                            <>
                              <div className="px-4 py-2 border-b border-gray-50">
                                <p className="text-[10px] font-semibold text-green-600 uppercase tracking-wide">Vendido</p>
                              </div>
                              <button onClick={() => navigate(`/edit-product/${product.id}`)} className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                Editar
                              </button>
                              <button onClick={() => updateProductStatus('available')} className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-yellow-50 transition-colors">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                Revertir Venta
                              </button>
                              <div className="border-t border-gray-50 mt-1 pt-1">
                                <button onClick={() => setShowDeleteModal(true)} className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                  Eliminar
                                </button>
                              </div>
                            </>
                          )}
                          {product.status === 'reserved' && (
                            <>
                              <div className="px-4 py-2 border-b border-gray-50">
                                <p className="text-[10px] font-semibold text-yellow-600 uppercase tracking-wide">Reservado</p>
                              </div>
                              <button onClick={() => navigate(`/edit-product/${product.id}`)} className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                Editar
                              </button>
                              <button onClick={() => setShowConfirmSaleModal(true)} className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 transition-colors">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Confirmar Venta
                              </button>
                              <button onClick={() => updateProductStatus('available')} className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>
                                Quitar Reserva
                              </button>
                              <div className="border-t border-gray-50 mt-1 pt-1">
                                <button onClick={() => setShowDeleteModal(true)} className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                  Eliminar
                                </button>
                              </div>
                            </>
                          )}
                          {product.status === 'hidden' && (
                            <>
                              <div className="px-4 py-2 border-b border-gray-50">
                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Oculto</p>
                              </div>
                              <button onClick={() => navigate(`/edit-product/${product.id}`)} className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                Editar
                              </button>
                              <button onClick={() => updateProductStatus('available')} className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 transition-colors">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                Mostrar Producto
                              </button>
                              <div className="border-t border-gray-50 mt-1 pt-1">
                                <button onClick={() => setShowDeleteModal(true)} className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                  Eliminar
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-5">
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{product.description}</p>
                  </div>

                  {/* Detalles del producto */}
                  <div className="mt-6 grid grid-cols-2 gap-2">
                    {product.condition && (
                      <div className="flex items-center gap-2.5 bg-gray-50/80 rounded-xl px-3.5 py-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Estado</p>
                          <p className="text-sm font-semibold text-gray-900">{product.condition}</p>
                        </div>
                      </div>
                    )}
                    {product.brand && (
                      <div className="flex items-center gap-2.5 bg-gray-50/80 rounded-xl px-3.5 py-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Marca</p>
                          <p className="text-sm font-semibold text-gray-900">{product.brand}</p>
                        </div>
                      </div>
                    )}
                    {product.view_count !== undefined && (
                      <div className="flex items-center gap-2.5 bg-gray-50/80 rounded-xl px-3.5 py-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Visitas</p>
                          <p className="text-sm font-semibold text-gray-900">{product.view_count}</p>
                        </div>
                      </div>
                    )}
                    {product.favorite_count !== undefined && (
                      <div className="flex items-center gap-2.5 bg-gray-50/80 rounded-xl px-3.5 py-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Favoritos</p>
                          <p className="text-sm font-semibold text-gray-900">{product.favorite_count}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Compartir */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mb-3">Compartir</p>
                    <ShareButton
                      url={`/product/${product.id}`}
                      title={`${product.title || product.name} · €${product.price}`}
                      description={product.description}
                      contentType="product"
                      contentId={product.id}
                      variant="button"
                      onShare={(platform) => { try { trackShare(product.id, platform); } catch {} }}
                    />
                  </div>
                </div>

{!isProductOwner && (
                    <div className="bg-white rounded-3xl border border-gray-100/80 shadow-sm p-6 sm:p-8">
                      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mb-4">Acciones</p>
                      <div className="space-y-2.5">
                        <button
                          onClick={() => scrollToSection('chat-section', startChat)}
                          className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl border border-gray-200 bg-white text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all text-sm"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Chatear con vendedor</span>
                        </button>
                        <button
                          onClick={() => scrollToSection('counteroffer-section', openCounterOfferModal)}
                          className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl border border-gray-200 bg-white text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all text-sm"
                        >
                          <Wallet className="w-4 h-4" />
                          <span>Hacer contraoferta</span>
                        </button>
                        {product?.status === 'available' && (
                          <button
                            onClick={() => navigate(`/checkout/${productId}`)}
                            className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-all text-sm shadow-sm hover:shadow-md"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span>Comprar ahora</span>
                          </button>
                        )}
                        <button
                          onClick={scrollToSellerInfo}
                          className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl border border-gray-200 bg-white text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all text-sm"
                        >
                          <UserIcon className="w-4 h-4" />
                          <span>Ver información del vendedor</span>
                        </button>
                      </div>
                    </div>
                  )}
              </div>

              </div>
            </div>
          </div>
        

        {/* MODAL DE PREVISUALIZACIÓN DE IMAGEN */}
        {imageModal.isOpen && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeImageModal}
          >
            <div className="relative max-w-5xl w-full max-h-[90vh]">
              <button
                onClick={closeImageModal}
                className="absolute top-3 right-3 text-white/70 hover:text-white z-10 bg-black/40 hover:bg-black/60 rounded-full w-9 h-9 flex items-center justify-center transition-colors backdrop-blur-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img
                src={imageModal.imageUrl}
                alt={imageModal.imageAlt}
                className="w-full max-h-[90vh] object-contain rounded-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
        
        
        {/* ESTADO DEL PRODUCTO - Solo mostrar si es el propietario */}
        {isProductOwner && product.status && (
          <div className="mb-4">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              product.status === 'available' ? 'bg-green-50 text-green-700 border border-green-200/60' :
              product.status === 'reserved' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200/60' :
              product.status === 'sold' ? 'bg-red-50 text-red-700 border border-red-200/60' :
              product.status === 'hidden' ? 'bg-gray-50 text-gray-500 border border-gray-200/60' :
              'bg-gray-50 text-gray-500'
            }`}>
              {product.status === 'available' ? 'Activo' :
               product.status === 'reserved' ? 'Reservado' :
               product.status === 'sold' ? 'Vendido' :
               product.status === 'hidden' ? 'Oculto' :
               product.status}
            </span>
          </div>
        )}

        {/* Badge de estado vendido */}
        {product.status === 'sold' && (
          <div className="bg-green-50/80 border border-green-200/50 rounded-2xl p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-green-100 text-green-700">
                Vendido
              </span>
              {product.sold_date && (
                <span className="text-xs text-green-500">{new Date(product.sold_date).toLocaleDateString()}</span>
              )}
            </div>
            {product.buyer_name && (
              <div className="text-sm text-gray-600 space-y-0.5">
                <p><span className="font-medium text-gray-700">Comprador:</span> {product.buyer_name}</p>
                {product.buyer_email && <p><span className="font-medium text-gray-700">Email:</span> {product.buyer_email}</p>}
                {product.buyer_phone && <p><span className="font-medium text-gray-700">Teléfono:</span> {product.buyer_phone}</p>}
                {product.sale_price && <p><span className="font-medium text-gray-700">Precio de venta:</span> € {product.sale_price}</p>}
              </div>
            )}
          </div>
        )}
        
        {/* Badge de estado reservado */}
        {product.status === 'reserved' && (
          <div className="bg-yellow-50/80 border border-yellow-200/50 rounded-2xl p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-yellow-100 text-yellow-700">
                Reservado
              </span>
              {product.reserved_date && (
                <span className="text-xs text-yellow-500">{new Date(product.reserved_date).toLocaleDateString()}</span>
              )}
            </div>
            {product.reserver_name && (
              <div className="text-sm text-gray-600 space-y-0.5">
                <p><span className="font-medium text-gray-700">Reservado para:</span> {product.reserver_name}</p>
                {product.reserver_email && <p><span className="font-medium text-gray-700">Email:</span> {product.reserver_email}</p>}
                {product.reserver_phone && <p><span className="font-medium text-gray-700">Teléfono:</span> {product.reserver_phone}</p>}
                {product.reserve_note && <p><span className="font-medium text-gray-700">Nota:</span> {product.reserve_note}</p>}
              </div>
            )}
          </div>
        )}

        

        {/* LOCALIZACION DEL PRODUCTO */}
        <div className="bg-white rounded-3xl border border-gray-100/80 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Ubicación</h2>
              <p className="text-xs text-gray-400">{product.location}</p>
            </div>
          </div>

          <div className="h-56 rounded-2xl overflow-hidden border border-gray-100">
            <MapContainer 
              center={[mapLocation.lat, mapLocation.lng]} 
              zoom={13} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[mapLocation.lat, mapLocation.lng]}>
                <Popup>
                  {product.location || 'Ubicación del producto'}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>

        {/* REPUTACIÓN DEL VENDEDOR */}
        <div className="bg-white rounded-3xl border border-gray-100/80 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <h2 className="text-sm font-semibold text-gray-900">Reputación del vendedor</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-4 h-4 ${i < Math.round(sellerAvgRating) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-900">{sellerAvgRating}/5</span>
            <span className="text-xs text-gray-400">· {sellerReviewCount} reseñas</span>
          </div>
          {latestSellerReviews.length > 0 && (
            <div className="mt-5 space-y-3">
              {latestSellerReviews.map((rev) => (
                <div key={rev.id} className="bg-gray-50/80 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-[10px] font-bold text-gray-500">{rev.buyer?.nombre?.charAt(0)?.toUpperCase() || '?'}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{rev.buyer?.nombre || 'Usuario'}</span>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-3 h-3 ${i < rev.rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  {rev.comment && <p className="text-sm text-gray-600 leading-relaxed">"{rev.comment}"</p>}
                  {rev.image_url && (
                    <div className="mt-3">
                      <img
                        src={getImageUrl(rev.image_url)}
                        alt="Reseña"
                        className="h-14 w-auto object-cover rounded-lg border border-gray-100 cursor-pointer"
                        onClick={() => window.open(getImageUrl(rev.image_url), '_blank')}
                        onError={(e) => { e.target.src = '/img/resmoke/noFoto.png'; }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
  </div>

  

  {/* Anuncio rectangular antes de productos relacionados */}
  <div className="flex justify-center my-8">
    <LazyAdBanner
      adSlot={adsenseConfig.adUnits.rectangle.slot}
      adFormat="rectangle"
      className="max-w-sm"
      style={{ width: '300px', height: '250px' }}
      threshold={0.4}
    />
  </div>

      {/* SECCIÓN DE PRODUCTOS RELACIONADOS */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="bg-white rounded-3xl border border-gray-100/80 shadow-sm py-10 sm:py-12 px-6 sm:px-10">
            <div className="mb-8 text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Productos Relacionados</h2>
              <p className="text-sm text-gray-400 mt-1.5">Descubre otros productos que podrían interesarte</p>
            </div>
            
            {relatedLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-gray-900 animate-spin" />
                  <span className="text-sm text-gray-400 font-medium">Cargando productos relacionados...</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {relatedProducts.map((relatedProduct) => {
                  const normalizeNumber = (value) => {
                    if (value === null || value === undefined) return null;
                    if (typeof value === 'number') return Number.isFinite(value) ? value : null;
                    if (typeof value === 'string') {
                      const parsed = parseFloat(value.replace(',', '.'));
                      return Number.isFinite(parsed) ? parsed : null;
                    }
                    const parsed = Number(value);
                    return Number.isFinite(parsed) ? parsed : null;
                  };

                  const formatMoney = (value) => {
                    const numberValue = normalizeNumber(value);
                    if (numberValue === null) return value;
                    return new Intl.NumberFormat('es-ES', { maximumFractionDigits: 2 }).format(numberValue);
                  };

                  const basePrice = normalizeNumber(relatedProduct?.price);
                  const salePrice = normalizeNumber(relatedProduct?.sale_price);
                  const hasDiscount = basePrice !== null && salePrice !== null && salePrice > 0 && salePrice < basePrice;

                  const createdAtMs = relatedProduct?.created_at ? new Date(relatedProduct.created_at).getTime() : null;
                  const ageMs = createdAtMs && Number.isFinite(createdAtMs) ? Date.now() - createdAtMs : null;
                  const isNew = ageMs !== null && ageMs >= 0 && ageMs <= 7 * 24 * 60 * 60 * 1000;

                  const viewCount = Number(relatedProduct?.view_count || 0);
                  const favoriteCount = Number(relatedProduct?.favorite_count || 0);
                  const isFastSelling = ageMs !== null && ageMs >= 0 && ageMs <= 14 * 24 * 60 * 60 * 1000 && (favoriteCount >= 5 || viewCount >= 100);

                  const badges = [
                    isNew ? { key: 'nuevo', label: 'Nuevo', className: 'bg-emerald-600 text-white' } : null,
                    hasDiscount ? { key: 'rebajado', label: 'Rebajado', className: 'bg-red-600 text-white' } : null,
                    isFastSelling ? { key: 'fast', label: 'Se vende rápido', className: 'bg-amber-500 text-gray-900' } : null
                  ].filter(Boolean);

                  return (
                    <div key={relatedProduct.id} className="group cursor-pointer" onClick={() => navigate(`/product/${relatedProduct.id}`)}>
                      <div className="bg-white rounded-2xl border border-gray-100/80 shadow-sm overflow-hidden transition-all duration-400 hover:shadow-md hover:-translate-y-1">
                        <div className="relative overflow-hidden">
                          <img 
                            src={getCardImageUrl(relatedProduct)}
                            alt={relatedProduct.name}
                            className="w-full h-44 object-cover transition duration-500 group-hover:scale-105 bg-gray-50"
                            onError={(e) => { e.target.src = '/img/resmoke/noFoto.png'; }}
                          />
                          {badges.length > 0 && (
                            <div className="absolute top-2 left-2 flex gap-1.5">
                              {badges.map((badge) => (
                                <span key={badge.key} className={`px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm ${badge.className}`}>
                                  {badge.label}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider bg-gray-50 px-2 py-0.5 rounded-full">
                              {relatedProduct.categories?.name || 'Sin categoría'}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-gray-900 mb-2 leading-snug line-clamp-2">{relatedProduct.name}</h3>
                          {hasDiscount ? (
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-base font-bold text-gray-900">€{formatMoney(salePrice)}</span>
                              <span className="text-xs text-gray-400 line-through">€{formatMoney(basePrice)}</span>
                            </div>
                          ) : (
                            <span className="text-base font-bold text-gray-900">€{formatMoney(relatedProduct.price)}</span>
                          )}
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                            <div className="flex items-center gap-1 text-gray-400">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="text-[11px]">{relatedProduct.location}</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-[11px] text-gray-400">
                              <span>{viewCount} vistas</span>
                              <span>{favoriteCount} favs</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            <div className="text-center mt-8">
              <button 
                onClick={() => navigate('/productos')}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
              >
                Ver todos los productos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL INFORMACION VENDEDOR */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-b from-gray-50 to-white px-6 pt-6 pb-4 border-b border-gray-100/60">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-inner">
                    <svg className="w-7 h-7 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{sellerData?.nombre || 'Nombre no disponible'}</h3>
                    {sellerData?.is_verified ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-50 border border-green-200/60 text-green-700 text-xs font-semibold">
                        Verificado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/60 text-amber-700 text-xs font-semibold">
                        Pendiente
                      </span>
                    )}
                  </div>
                </div>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100/80 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 p-3.5 bg-gray-50/70 rounded-xl border border-gray-100/50">
                  <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Correo</p>
                    <p className="text-sm font-medium text-gray-900">{sellerData?.email || 'No disponible'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3.5 bg-gray-50/70 rounded-xl border border-gray-100/50">
                  <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Teléfono</p>
                    <p className="text-sm font-medium text-gray-900">{sellerData?.telefono || 'No disponible'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 pb-6 space-y-2.5">
              <button 
                className="w-full bg-gray-900 text-white py-3 px-4 rounded-xl hover:bg-gray-800 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                onClick={() => {
                  closeModal();
                  navigate(`/seller/${product.user_id}`);
                }}
              >
                Ver perfil
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <button 
                onClick={closeModal}
                className="w-full bg-gray-100 text-gray-500 py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL MARCAR COMO VENDIDO */}
      {showSoldModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-b from-gray-50 to-white px-6 pt-6 pb-4 border-b border-gray-100/60">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Marcar como vendido</h2>
                    <p className="text-sm text-gray-500 truncate max-w-[300px]">{product?.name}</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setShowSoldModal(false); setBuyerInfo({ name: '', email: '', phone: '' }); setSalePrice(''); setSelectedBuyer(null); setSearchQuery(''); setSearchResults([]); }}
                  className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100/80 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="bg-white/80 rounded-xl p-3 border border-gray-100/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Precio original</span>
                  <span className="text-sm font-semibold text-gray-900">€ {product?.price || 0}</span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
                <button
                  onClick={() => { setShowUserSearch(true); setSelectedBuyer(null); setBuyerInfo({ name: '', email: '', phone: '' }); }}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    showUserSearch ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Registrado
                </button>
                <button
                  onClick={() => { setShowUserSearch(false); setSelectedBuyer(null); setSearchQuery(''); setSearchResults([]); }}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    !showUserSearch ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Manual
                </button>
              </div>

              <div className="space-y-4">
                {showUserSearch ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Buscar usuario *</label>
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); searchUsers(e.target.value); }}
                        className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-gray-300 text-sm"
                        placeholder="Nombre o email..."
                      />
                      {isSearching && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-transparent"></div>
                        </div>
                      )}
                    </div>
                    
                    {searchResults.length > 0 && (
                      <div className="mt-2 border border-gray-200 rounded-xl max-h-36 overflow-y-auto divide-y divide-gray-100">
                        {searchResults.map((user) => (
                          <button key={user.id} onClick={() => selectBuyer(user)}
                            className="w-full text-left px-3.5 py-2.5 hover:bg-gray-50 transition-colors"
                          >
                            <div className="font-medium text-gray-900 text-sm">{user.nombre}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
                      <div className="mt-2 text-xs text-gray-400 text-center py-3 bg-gray-50 rounded-xl">Sin resultados</div>
                    )}
                    
                    {selectedBuyer && (
                      <div className="mt-3 flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-xs font-bold text-gray-600">{selectedBuyer.nombre?.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{selectedBuyer.nombre}</div>
                            <div className="text-xs text-gray-500">{selectedBuyer.email}</div>
                          </div>
                        </div>
                        <button onClick={() => { setSelectedBuyer(null); setBuyerInfo({ name: '', email: '', phone: '' }); }}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre *</label>
                      <input type="text" value={buyerInfo.name} onChange={(e) => setBuyerInfo(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-gray-300 text-sm"
                        placeholder="Ej: Juan Pérez" required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                      <input type="email" value={buyerInfo.email} onChange={(e) => setBuyerInfo(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-gray-300 text-sm"
                        placeholder="ej: juan@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Teléfono</label>
                      <input type="tel" value={buyerInfo.phone} onChange={(e) => setBuyerInfo(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-gray-300 text-sm"
                        placeholder="+51 999 888 777"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Precio final (opcional)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">€</span>
                    <input type="number" value={salePrice} onChange={(e) => setSalePrice(e.target.value)}
                      className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-gray-300 text-sm"
                      placeholder={`Original: €${product?.price || 0}`} min="0" step="0.01"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Al marcar como vendido:</p>
                    <ul className="text-xs text-gray-500 space-y-0.5">
                      <li>• El producto dejará de aparecer en búsquedas</li>
                      <li>• Se guardará la información del comprador</li>
                      <li>• Podrás revertir esta acción si es necesario</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => { setShowSoldModal(false); setBuyerInfo({ name: '', email: '', phone: '' }); setSalePrice(''); setSelectedBuyer(null); setSearchQuery(''); setSearchResults([]); }}
                disabled={soldLoading}
                className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium disabled:opacity-50"
              >Cancelar</button>
              <button onClick={markAsSold}
                disabled={soldLoading || (showUserSearch ? !selectedBuyer : !buyerInfo.name.trim())}
                className="flex-1 bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {soldLoading ? (
                  <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div><span>Guardando...</span></>
                ) : <span>Confirmar Venta</span>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE RESERVAR PRODUCTO */}
      {showReserveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-b from-gray-50 to-white px-6 pt-6 pb-4 border-b border-gray-100/60">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Reservar Producto</h2>
                    <p className="text-sm text-gray-500">Selecciona a quién se le reservará</p>
                  </div>
                </div>
                <button onClick={() => { setShowReserveModal(false); setReserveNote(''); setSelectedReserver(null); setReserveSearchQuery(''); setReserverInfo({ name: '', email: '', phone: '' }); }}
                  className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100/80 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="bg-white/80 rounded-xl p-3 border border-gray-100/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">€{product.price}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
                <button onClick={() => setShowReserveUserSearch(true)}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    showReserveUserSearch ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Registrado
                </button>
                <button onClick={() => setShowReserveUserSearch(false)}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    !showReserveUserSearch ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Manual
                </button>
              </div>

              {showReserveUserSearch ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Buscar usuario</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input type="text" value={reserveSearchQuery}
                      onChange={(e) => { setReserveSearchQuery(e.target.value); searchUsersForReserve(e.target.value); }}
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-gray-300 text-sm"
                      placeholder="Nombre o email..."
                    />
                    {selectedReserver && (
                      <button onClick={clearReserverSelection} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {reserveSearchResults.length > 0 && (
                    <div className="mt-2 border border-gray-200 rounded-xl max-h-36 overflow-y-auto divide-y divide-gray-100">
                      {reserveSearchResults.map((user) => (
                        <button key={user.id} onClick={() => selectReserverUser(user)}
                          className="w-full text-left px-3.5 py-2.5 hover:bg-gray-50 transition-colors"
                        >
                          <div className="font-medium text-gray-900 text-sm">{user.nombre}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </button>
                      ))}
                    </div>
                  )}

                  {isReserveSearching && (
                    <div className="mt-2 flex justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-transparent"></div>
                    </div>
                  )}

                  {selectedReserver && (
                    <div className="mt-3 flex items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-xs font-bold text-gray-600">{selectedReserver.nombre?.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{selectedReserver.nombre}</div>
                          <div className="text-xs text-gray-500">{selectedReserver.email}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre completo *</label>
                    <input type="text" value={reserverInfo.name} onChange={(e) => setReserverInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-gray-300 text-sm"
                      placeholder="Nombre del cliente"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                    <input type="email" value={reserverInfo.email} onChange={(e) => setReserverInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-gray-300 text-sm"
                      placeholder="email@ejemplo.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Teléfono</label>
                    <input type="tel" value={reserverInfo.phone} onChange={(e) => setReserverInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-gray-300 text-sm"
                      placeholder="+34 123 456 789"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nota de la reserva</label>
                <textarea value={reserveNote} onChange={(e) => setReserveNote(e.target.value)}
                  placeholder="Ej: Reservado hasta el viernes..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-gray-300 text-sm resize-none"
                  rows={3} maxLength={500}
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{reserveNote.length}/500</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Al reservar:</p>
                    <ul className="text-xs text-gray-500 space-y-0.5">
                      <li>• El producto se marcará como "reservado"</li>
                      <li>• Se guardará la información del cliente</li>
                      <li>• Otros usuarios verán que está reservado</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => { setShowReserveModal(false); setReserveNote(''); setSelectedReserver(null); setReserveSearchQuery(''); setReserverInfo({ name: '', email: '', phone: '' }); }}
                disabled={reserveLoading}
                className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium disabled:opacity-50"
              >Cancelar</button>
              <button onClick={reserveProduct} disabled={reserveLoading}
                className="flex-1 bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {reserveLoading ? <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>Reservando...</> : <>Confirmar Reserva</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMACIÓN DE VENTA */}
      {showConfirmSaleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-b from-gray-50 to-white px-6 pt-6 pb-4 border-b border-gray-100/60 text-center">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm border border-gray-100">
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900">¿Confirmar venta?</h2>
              <p className="text-sm text-gray-500 mt-1">Estás a punto de confirmar la venta de <span className="font-medium text-gray-700">"{product?.title}"</span></p>
            </div>
            
            <div className="p-6 space-y-4">
              {product?.reserver_name && (
                <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Reservado por</p>
                    <p className="text-sm font-semibold text-gray-900">{product.reserver_name}</p>
                    {product.reserver_email && <p className="text-xs text-gray-500">{product.reserver_email}</p>}
                  </div>
                </div>
              )}
              
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Al confirmar la venta:</p>
                    <ul className="text-xs text-gray-500 space-y-0.5">
                      <li>• El producto se marcará como vendido</li>
                      <li>• Se registrará la venta al usuario reservado</li>
                      <li>• El producto dejará de aparecer en búsquedas</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowConfirmSaleModal(false)} disabled={soldLoading}
                className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium disabled:opacity-50"
              >Cancelar</button>
              <button onClick={confirmSaleToReserver} disabled={soldLoading}
                className="flex-1 bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {soldLoading ? <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>Confirmando...</> : <>Confirmar Venta</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMACIÓN OCULTAR PRODUCTO */}
      {showHideModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-b from-gray-50 to-white px-6 pt-6 pb-4 border-b border-gray-100/60 text-center">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm border border-gray-100">
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900">¿Ocultar producto?</h2>
              <p className="text-sm text-gray-500 mt-1">"{product.name}" será ocultado y no aparecerá en búsquedas públicas.</p>
            </div>
            
            <div className="p-6 flex gap-3">
              <button onClick={() => setShowHideModal(false)}
                className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium"
              >Cancelar</button>
              <button onClick={() => { updateProductStatus('hidden'); setShowHideModal(false); }}
                className="flex-1 bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition-colors text-sm font-medium"
              >Ocultar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMACION ELIMINAR */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-b from-red-50/50 to-white px-6 pt-6 pb-4 border-b border-gray-100/60 text-center">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-3 border border-red-100">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900">¿Eliminar producto?</h2>
              <p className="text-sm text-gray-500 mt-1">Estás a punto de eliminar <span className="font-medium text-gray-700">"{product?.name}"</span></p>
              <p className="text-xs text-red-400 mt-2 font-medium">Esta acción no se puede deshacer</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-red-50/50 rounded-xl p-4 border border-red-100/50">
                <div className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-xs font-medium text-red-800 mb-1">Se eliminará permanentemente:</p>
                    <ul className="text-xs text-red-600 space-y-0.5">
                      <li>• Información del producto</li>
                      <li>• Todas las imágenes asociadas</li>
                      <li>• Historial de favoritos</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowDeleteModal(false)} disabled={loading}
                className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium disabled:opacity-50"
              >Cancelar</button>
              <button onClick={deleteProduct} disabled={loading}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>Eliminando...</> : <>Eliminar definitivamente</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ MODAL DE CHAT PARA DESKTOP */}
      {isChatModalOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300"
            onClick={() => setIsChatModalOpen(false)}
          />
          
          {/* Modal */}
          <div className="fixed right-0 top-0 m-2 h-full w-[400px] bg-white/95 backdrop-blur-xl shadow-2xl border border-gray-100 z-50 transform transition-transform duration-300 flex flex-col rounded-3xl overflow-hidden">
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <span className="font-bold text-lg text-gray-700">
                    {selectedConversation?.otherUser?.nombre?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{selectedConversation?.otherUser?.nombre || 'Usuario'}</h3>
                  <p className="text-gray-500 text-sm truncate">{selectedConversation?.product?.name || 'Producto'}</p>
                </div>
              </div>
              <button
                onClick={() => setIsChatModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-all duration-200 p-2 rounded-xl hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-700 font-semibold mb-1">¡Inicia la conversación!</p>
                  <p className="text-sm text-gray-500">Envía el primer mensaje sobre <span className="font-medium text-gray-700">{selectedConversation?.product?.name}</span></p>
                </div>
              ) : (
                messages.map((message) => {
                  const isOwn = message.sender_id === currentUserDbId;
                  const text = String(message.message || '');
                  const isLocation = text.includes('[[LOCATION:');
                  return (
                  <div
                    key={message.id}
                    className={`flex ${message.sender_id === currentUserDbId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs ${isLocation ? 'p-0 overflow-hidden' : 'px-5 py-3'} rounded-3xl shadow-lg transition-all duration-300 ${
                        isOwn
                          ? 'bg-gray-600 text-white rounded-br-lg'
                          : 'bg-white text-gray-800 border border-gray-100 rounded-bl-lg'
                      }`}
                    >
                      {(() => {
                        const locToken = text.match(/\[\[LOCATION:([-0-9.]+),([-0-9.]+)\]\]/);
                        const urlMatch = text.match(/https?:\/\/(www\.)?maps\.google\.[^ \n]+/i) || text.match(/https?:\/\/(www\.)?google\.[^ \n]+\/maps[^ \n]*/i);
                        if (locToken) {
                          const lat = Number.parseFloat(locToken[1]);
                          const lng = Number.parseFloat(locToken[2]);
                          if (!Number.isFinite(lat) || !Number.isFinite(lng)) return <p className="text-sm break-words">{text}</p>;
                          const url = `https://www.google.com/maps?q=${lat},${lng}`;
                          return (
                            <button
                              type="button"
                              onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
                              className="w-full text-left"
                            >
                              <div className="w-full h-36 overflow-hidden">
                                <MapContainer
                                  center={[lat, lng]}
                                  zoom={15}
                                  scrollWheelZoom={false}
                                  dragging={false}
                                  doubleClickZoom={false}
                                  touchZoom={false}
                                  keyboard={false}
                                  zoomControl={false}
                                  attributionControl={false}
                                  className="h-full w-full pointer-events-none"
                                  whenReady={(e) => {
                                    window.setTimeout(() => e.target.invalidateSize(), 0);
                                  }}
                                >
                                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                  <Marker position={[lat, lng]} />
                                </MapContainer>
                              </div>
                              <div className="p-3">
                                <div className="text-sm font-semibold">Ubicación compartida</div>
                                <div className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-600'}`}>{lat}, {lng}</div>
                                <div className={`text-xs mt-2 underline ${isOwn ? 'text-white' : 'text-gray-700'}`}>Abrir en Google Maps</div>
                              </div>
                            </button>
                          );
                        }
                        if (urlMatch && text.toLowerCase().includes('ubicaci')) {
                          const url = urlMatch[0];
                          return (
                            <button
                              type="button"
                              onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
                              className="w-full text-left p-3"
                            >
                              <div className="text-sm font-semibold">Ubicación compartida</div>
                              <div className={`text-xs mt-2 underline ${isOwn ? 'text-white' : 'text-gray-700'}`}>Abrir en Google Maps</div>
                            </button>
                          );
                        }
                        return <p className="text-sm break-words">{text}</p>;
                      })()}
                      <p className={`text-xs mt-1 ${
                        isOwn ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatChatTime(message.created_at)}
                      </p>
                    </div>
                  </div>
                  );
                })
              )}
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-6 bg-white/80 backdrop-blur-sm">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !chatLoading && sendChatMessage()}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 border border-gray-300 rounded-2xl px-5 py-3 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-all duration-200 bg-white shadow-sm"
                  disabled={chatLoading}
                />
                <button
                  onClick={() => {
                    if (!navigator.geolocation) {
                      alert('Tu dispositivo no soporta ubicación');
                      return;
                    }
                    navigator.geolocation.getCurrentPosition(
                      (pos) => {
                        const { latitude, longitude } = pos.coords;
                        sendChatMessage(`[[LOCATION:${latitude},${longitude}]]`);
                      },
                      () => {
                        alert('No se pudo obtener tu ubicación');
                      },
                      { enableHighAccuracy: true, timeout: 10000 }
                    );
                  }}
                  disabled={chatLoading}
                  className="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-200 text-gray-900 p-3 rounded-2xl transition-all duration-200 shadow-sm"
                  aria-label="Compartir ubicación"
                  title="Compartir ubicación"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11a3 3 0 100-6 3 3 0 000 6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 10.5c0 7.5-7.5 12-7.5 12s-7.5-4.5-7.5-12a7.5 7.5 0 1115 0z" />
                  </svg>
                </button>
                <button
                  onClick={sendChatMessage}
                  disabled={chatLoading || !newMessage.trim()}
                  className="bg-gray-600 hover:bg-gray-900 disabled:bg-gray-300 text-white p-3 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none"
                >
                  {chatLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ✅ MODAL DE CONTRAOFERTA */}
      {showCounterOfferModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-b from-gray-50 to-white px-6 pt-6 pb-4 border-b border-gray-100/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Realizar Contraoferta</h2>
                    <p className="text-sm text-gray-500">Para: {product?.title}</p>
                  </div>
                </div>
                <button onClick={closeCounterOfferModal} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100/80 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleCounterOfferSubmit} className="p-6 space-y-5">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Precio actual del producto:</p>
                <p className="text-2xl font-bold text-gray-900">
                  € {product?.price ? parseFloat(product.price).toLocaleString('es-PE', { minimumFractionDigits: 2 }) : '0.00'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tu contraoferta <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">€</span>
                  <input type="number" step="0.01" min="0"
                    value={counterOfferData.amount}
                    onChange={(e) => setCounterOfferData({...counterOfferData, amount: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-gray-300 text-sm"
                    placeholder="0.00" required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje para el vendedor</label>
                <textarea value={counterOfferData.message}
                  onChange={(e) => setCounterOfferData({...counterOfferData, message: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-gray-300 text-sm resize-none"
                  rows={4} placeholder="Explica por qué consideras que este precio es justo..."
                />
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Información importante</p>
                    <ul className="text-xs text-gray-500 space-y-0.5">
                      <li>• El vendedor recibirá una notificación de tu contraoferta</li>
                      <li>• Puede aceptar, rechazar o hacer una contraoferta</li>
                      <li>• Sé respetuoso y justifica tu propuesta</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeCounterOfferModal} disabled={counterOfferLoading}
                  className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium disabled:opacity-50"
                >Cancelar</button>
                <button type="submit" disabled={counterOfferLoading || !counterOfferData.amount}
                  className="flex-1 bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {counterOfferLoading ? (
                    <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div><span>Enviando...</span></>
                  ) : <span>Enviar Contraoferta</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE COMPRA */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-b from-gray-50 to-white px-6 pt-6 pb-4 border-b border-gray-100/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Confirmar Compra</h2>
                    <p className="text-sm text-gray-500">¿Estás seguro de comprar este producto?</p>
                  </div>
                </div>
                <button onClick={() => setShowPurchaseModal(false)} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100/80 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <img src={getImageUrl(product?.image_url)} alt={product?.title}
                    className="w-16 h-16 object-cover rounded-xl border border-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">{product?.title}</h4>
                    <p className="text-sm text-gray-500">{category?.name}</p>
                    <p className="text-lg font-bold text-gray-900">
                      € {product?.price ? parseFloat(product.price).toLocaleString('es-PE', { minimumFractionDigits: 2 }) : '0.00'}
                    </p>
                  </div>
                </div>
              </div>

              {sellerData && (
                <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-600">
                      {sellerData.name ? sellerData.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Vendedor</p>
                    <p className="text-sm font-medium text-gray-900">{sellerData.name}</p>
                    <p className="text-xs text-gray-500">{sellerData.email}</p>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Importante</p>
                    <ul className="text-xs text-gray-500 space-y-0.5">
                      <li>• Esta acción marcará el producto como vendido</li>
                      <li>• No podrás deshacer esta operación</li>
                      <li>• El producto dejará de estar disponible</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowPurchaseModal(false)} disabled={purchaseLoading}
                  className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium disabled:opacity-50"
                >Cancelar</button>
                <button type="button" onClick={handlePurchase} disabled={purchaseLoading}
                  className="flex-1 bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {purchaseLoading ? <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div><span>Procesando...</span></> : <span>Confirmar Compra</span>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductPage;
