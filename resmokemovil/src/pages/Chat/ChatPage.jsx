import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ChatPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserDbId, setCurrentUserDbId] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [product, setProduct] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [offersById, setOffersById] = useState({});
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const parseLocationMessage = (messageText) => {
    const text = String(messageText || '');
    const locationTokenMatch = text.match(/\[\[LOCATION:([-0-9.]+),([-0-9.]+)\]\]/);
    if (locationTokenMatch) {
      const lat = Number.parseFloat(locationTokenMatch[1]);
      const lng = Number.parseFloat(locationTokenMatch[2]);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
      const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
      return { lat, lng, mapsUrl };
    }

    const urlMatch = text.match(/https?:\/\/(www\.)?maps\.google\.[^ \n]+/i) || text.match(/https?:\/\/(www\.)?google\.[^ \n]+\/maps[^ \n]*/i);
    if (urlMatch && text.toLowerCase().includes('ubicaci')) {
      return { lat: null, lng: null, mapsUrl: urlMatch[0] };
    }

    return null;
  };

  const fetchOffers = async (productId, buyerId, sellerId) => {
    if (!productId || !buyerId || !sellerId) return;
    try {
      const participants = [buyerId, sellerId];
      const { data, error } = await supabase
        .from('counter_offers')
        .select('*')
        .eq('product_id', productId)
        .in('sender_id', participants)
        .in('receiver_id', participants)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const next = {};
      for (const offer of data || []) {
        next[String(offer.id)] = offer;
      }
      setOffersById(next);
    } catch (error) {
      console.error('Error cargando ofertas:', error);
    }
  };

  // Función para manejar aceptar contraoferta
  const handleAcceptCounterOffer = async (offerAmount) => {
    try {
      if (!product || !currentUserDbId) return;

      // Marcar producto como vendido
      const { error: productError } = await supabase
        .from('products')
        .update({
          status: 'sold',
          sold_date: new Date().toISOString(),
          buyer_user_id: otherUser.id,
          sale_price: parseFloat(offerAmount)
        })
        .eq('id', product.id);

      if (productError) throw productError;

      // Enviar mensaje de confirmación
      const confirmationMessage = `✅ OFERTA ACEPTADA - PRODUCTO VENDIDO\n\n` +
        `Producto: ${product.name}\n` +
        `Precio acordado: €${parseFloat(offerAmount).toLocaleString()}\n` +
        `Fecha de venta: ${new Date().toLocaleDateString('es-ES')}\n\n` +
        `Próximos pasos:\n` +
        `• Coordinar la entrega del producto\n` +
        `• Realizar el pago acordado\n\n` +
        `Venta confirmada el ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;

      await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: currentUserDbId,
          message: confirmationMessage,
          is_read: false
        });

      // Actualizar timestamp de conversación
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      try {
        const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
        const emailEndpoint = isLocal ? 'http://localhost:3001/api/email/send' : '/.netlify/functions/email-send';
        const sellerEmail = (conversation && conversation.seller && conversation.seller.email) ? conversation.seller.email : null;
        const buyerEmail = (conversation && conversation.buyer && conversation.buyer.email) ? conversation.buyer.email : (otherUser && otherUser.email ? otherUser.email : null);
        const recipients = [buyerEmail].filter(Boolean);
        await fetch(emailEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: recipients,
            template: 'counter_offer_accepted',
            subject: `Contraoferta aceptada · ${product.name}`,
            props: {
              productName: product.name,
              amount: parseFloat(offerAmount).toLocaleString('es-ES'),
              sellerName: (conversation && conversation.seller && conversation.seller.nombre) ? conversation.seller.nombre : '',
              buyerName: (conversation && conversation.buyer && conversation.buyer.nombre) ? conversation.buyer.nombre : '',
              uploaderEmail: sellerEmail || '',
            },
          }),
        });
      } catch (e) {
        console.error('Error enviando email:', e);
      }

      // Recargar mensajes
      loadMessages();
      
    } catch (error) {
      console.error('Error aceptando contraoferta:', error);
      alert('Error al aceptar la contraoferta. Inténtalo de nuevo.');
    }
  };

  // Función para manejar contraoferta
  const handleCounterOffer = async () => {
    const counterOfferText = prompt('Ingresa tu contraoferta:');
    if (counterOfferText && counterOfferText.trim()) {
      const amount = parseFloat(counterOfferText.replace(/[^0-9.,]/g, '').replace(',', '.'));
      if (!isNaN(amount)) {
        if (!product?.id || !currentUserDbId || !otherUser?.id) return;
        try {
          const { data: offer, error } = await supabase
            .from('counter_offers')
            .insert({
              product_id: product.id,
              sender_id: currentUserDbId,
              receiver_id: otherUser.id,
              amount: parseFloat(amount),
              message: null,
              status: 'pending',
              is_read: false
            })
            .select()
            .single();

          if (error) throw error;

          const composed = `[[OFERTA:${offer.id}]] Oferta propuesta: €${parseFloat(amount).toLocaleString('es-ES')}`;
          await sendMessage(composed);
          await fetchOffers(product.id, conversation?.buyer_id, conversation?.seller_id);
        } catch (error) {
          console.error('Error creando oferta:', error);
          alert('Error al enviar la oferta. Inténtalo de nuevo.');
        }
      }
    }
  };

  const respondToOffer = async (offerId, response) => {
    try {
      const offer = offersById[String(offerId)];
      if (!offer || !product || !conversation) return;

      const status = response === 'accept' ? 'accepted' : 'rejected';
      await supabase.from('counter_offers').update({ status }).eq('id', offerId);

      if (response === 'accept') {
        const productOwnerId = product.user_id;
        const buyerId = offer.sender_id === productOwnerId ? offer.receiver_id : offer.sender_id;

        const { error: productError } = await supabase
          .from('products')
          .update({
            status: 'sold',
            sold_date: new Date().toISOString(),
            buyer_user_id: buyerId,
            sale_price: parseFloat(offer.amount)
          })
          .eq('id', product.id);

        if (productError) throw productError;

        const confirmationMessage = `✅ OFERTA ACEPTADA - PRODUCTO VENDIDO\n\n` +
          `Producto: ${product.name}\n` +
          `Precio acordado: €${parseFloat(offer.amount).toLocaleString()}\n` +
          `Fecha de venta: ${new Date().toLocaleDateString('es-ES')}\n\n` +
          `Próximos pasos:\n` +
          `• Coordinar la entrega del producto\n` +
          `• Realizar el pago acordado\n\n` +
          `Venta confirmada el ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;

        await supabase
          .from('messages')
          .insert({
            conversation_id: conversationId,
            sender_id: currentUserDbId,
            message: confirmationMessage,
            is_read: false
          });

        await supabase
          .from('conversations')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', conversationId);

        try {
          const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
          const emailEndpoint = isLocal ? 'http://localhost:3001/api/email/send' : '/.netlify/functions/email-send';
          const sellerEmail = (conversation && conversation.seller && conversation.seller.email) ? conversation.seller.email : null;
          const buyerEmail = (conversation && conversation.buyer && conversation.buyer.email) ? conversation.buyer.email : (otherUser && otherUser.email ? otherUser.email : null);
          const recipients = [buyerEmail].filter(Boolean);
          await fetch(emailEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: recipients,
              template: 'counter_offer_accepted',
              subject: `Contraoferta aceptada · ${product.name}`,
              props: {
                productName: product.name,
                amount: parseFloat(offer.amount).toLocaleString('es-ES'),
                sellerName: (conversation && conversation.seller && conversation.seller.nombre) ? conversation.seller.nombre : '',
                buyerName: (conversation && conversation.buyer && conversation.buyer.nombre) ? conversation.buyer.nombre : '',
                uploaderEmail: sellerEmail || '',
              },
            }),
          });
        } catch (e) {
        }
      } else {
        const rejectionMessage = `❌ OFERTA RECHAZADA\n\n` +
          `Producto: ${product?.name || ''}\n` +
          `Oferta: €${parseFloat(offer.amount).toLocaleString('es-ES')}\n\n` +
          `Respuesta enviada el ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;

        await supabase
          .from('messages')
          .insert({
            conversation_id: conversationId,
            sender_id: currentUserDbId,
            message: rejectionMessage,
            is_read: false
          });

        await supabase
          .from('conversations')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', conversationId);
      }

      await fetchOffers(product.id, conversation?.buyer_id, conversation?.seller_id);
      await fetchMessages();
    } catch (error) {
      console.error('Error respondiendo oferta:', error);
      alert('Error al procesar la oferta. Inténtalo de nuevo.');
    }
  };

  const renderMessageWithButtons = (messageText, isOwn) => {
  const location = parseLocationMessage(messageText);
  if (location) {
    return (
      <button
        type="button"
        onClick={() => window.open(location.mapsUrl, '_blank', 'noopener,noreferrer')}
        className="w-full text-left"
      >
        {location.lat != null && location.lng != null ? (
          <div className="w-full">
            <div className="w-full h-36 overflow-hidden">
              <MapContainer
                center={[location.lat, location.lng]}
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
                <Marker position={[location.lat, location.lng]} />
              </MapContainer>
            </div>
            <div className={`p-3 ${isOwn ? 'text-white' : 'text-gray-900'}`}>
              <div className="text-sm font-semibold">Ubicación compartida</div>
              {location.lat && location.lng && (
                <div className={`text-xs mt-1 ${isOwn ? 'text-gray-200' : 'text-gray-600'}`}>{location.lat}, {location.lng}</div>
              )}
              <div className={`text-xs mt-2 underline ${isOwn ? 'text-gray-100' : 'text-gray-700'}`}>Abrir en Google Maps</div>
            </div>
          </div>
        ) : (
          <div className={`p-3 ${isOwn ? 'text-white' : 'text-gray-900'}`}>
            <div className="text-sm font-semibold">Ubicación compartida</div>
            <div className={`text-xs mt-2 underline ${isOwn ? 'text-gray-100' : 'text-gray-700'}`}>Abrir en Google Maps</div>
          </div>
        )}
      </button>
    );
  }

  const offerTokenMatch = messageText.match(/\[\[OFERTA:(\d+)\]\]/);
  if (offerTokenMatch) {
    const offerId = offerTokenMatch[1];
    const offer = offersById[String(offerId)];
    const amountMatch = messageText.match(/Oferta propuesta:\s*[€$]\s*([\d.,]+)/i);
    const fallbackAmount = amountMatch ? amountMatch[1].replace(/,/g, '') : null;
    const amount = offer?.amount ?? fallbackAmount ?? '0';
    const status = offer?.status || 'pending';
    const canRespond = !isOwn && offer && currentUserDbId && offer.receiver_id === currentUserDbId && status === 'pending';

    return (
      <div className="space-y-3">
        <div className="text-sm font-semibold text-gray-800">Oferta</div>
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <div className="text-sm text-gray-700">Producto: {product?.name || ''}</div>
          <div className="text-sm font-semibold text-blue-600">€{parseFloat(amount).toFixed(2)}</div>
          {status !== 'pending' && (
            <div className="text-xs text-gray-500">
              Estado: {status === 'accepted' ? 'aceptada' : status === 'rejected' ? 'rechazada' : status}
            </div>
          )}
        </div>

        {canRespond && (
          <div className="space-y-2">
            <button
              onClick={() => respondToOffer(offer.id, 'reject')}
              className="w-full bg-white hover:bg-gray-100 text-gray-900 py-2 px-4 rounded-lg font-medium transition-colors duration-200 border border-gray-300"
            >
              Rechazar
            </button>

            <button
              onClick={() => respondToOffer(offer.id, 'accept')}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
            >
              Aceptar
            </button>
          </div>
        )}
      </div>
    );
  }

  // Detectar si el mensaje contiene botones de contraoferta
  if (messageText.includes('[CONTRAOFERTA]') && messageText.includes('[ACEPTAR]')) {
    // Extraer el monto de la oferta
    const offerMatch = messageText.match(/Oferta propuesta:\s*[€$]\s*([\d.,]+)/i);
    const offerAmount = offerMatch ? offerMatch[1].replace(/,/g, '') : '0';

    // Extraer líneas relevantes del mensaje
    const lines = messageText.split('\n');
    const headerLine = lines.find(line => line.toLowerCase().includes('nueva contraoferta')) || '';
    const productLine = lines.find(line => line.includes('Producto:')) || '';
    const originalPriceLine = lines.find(line => line.includes('Precio original:')) || '';
    const offerLine = lines.find(line => line.toLowerCase().includes('oferta propuesta')) || '';
    const messageLine = lines.find(line => line.includes('Mensaje:')) || '';
    const timeLine = lines.find(line => line.includes('Contraoferta recibida el')) || '';

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            {headerLine.replace(/🎯|/g, '')}
          </h3>
        </div>

        {/* Información del producto */}
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <div className="text-sm text-gray-700">{productLine}</div>
          <div className="text-sm text-gray-700">{originalPriceLine}</div>
          <div className="text-sm font-semibold text-blue-600">{offerLine}</div>
          {messageLine && <div className="text-sm text-gray-600">{messageLine}</div>}
        </div>

        {/* Botones de acción */}
        {!isOwn && (
          <div className="space-y-2">
            <div className="text-xs text-gray-500 text-center mb-3">
              €{parseFloat(offerAmount).toFixed(2)}
            </div>

            <button
              onClick={() => handleCounterOffer()}
              className="w-full bg-white hover:bg-gray-100 text-gray-900 py-2 px-4 rounded-lg font-medium transition-colors duration-200 border border-gray-300"
            >
              Rechazar
            </button>

            <button
              onClick={() => handleAcceptCounterOffer(offerAmount)}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
            >
              Aceptar
            </button>
          </div>
        )}

        {/* Timestamp */}
        {timeLine && (
          <div className="text-xs text-gray-400 text-center mt-3">
            {timeLine.replace(/⏰ \*/g, '').replace(/\*/g, '')}
          </div>
        )}
      </div>
    );
  }

  // Renderizado normal para otros mensajes
  return (
    <p className="whitespace-pre-line text-sm leading-relaxed break-words font-medium">
      {messageText}
    </p>
  );
};

  // ... existing code ...
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchCurrentUserDbId = async () => {
    if (!user) return;
    try {
      const { data: userData, error } = await supabase
        .from('Users')
        .select('id')
        .eq('email', user.email)
        .single();

      if (error) throw error;
      setCurrentUserDbId(userData.id);
      return userData.id;
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      return null;
    }
  };

  const fetchConversation = async (userDbId) => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          products (*),
          buyer:buyer_id (id, nombre, email),
          seller:seller_id (id, nombre, email)
        `)
        .eq('id', conversationId)
        .single();

      if (error) throw error;

      setConversation(data);
      setProduct(data.products);
      
      const other = data.buyer_id === userDbId ? data.seller : data.buyer;
      setOtherUser(other);
      
      return data;
    } catch (error) {
      console.error('Error obteniendo conversación:', error);
      return null;
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id (id, nombre)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error obteniendo mensajes:', error);
    }
  };

  const markMessagesAsRead = async (userDbId) => {
    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', userDbId)
        .eq('is_read', false);
    } catch (error) {
      console.error('Error marcando mensajes como leídos:', error);
    }
  };

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  const sendMessage = async (textOverride) => {
    const outgoing = typeof textOverride === 'string' ? textOverride : newMessage;
    if (!outgoing.trim() || sending || !currentUserDbId) return;
    if (user && user.isVerified === false) {
      alert('Debes verificar tu correo electrónico para enviar mensajes')
      return
    }

    setSending(true);
    setIsTyping(false);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: currentUserDbId,
          message: outgoing.trim()
        });

      if (error) throw error;

      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      try {
        const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
        const emailEndpoint = isLocal ? 'http://localhost:3001/api/email/send' : '/.netlify/functions/email-send';
        const recipientEmail = otherUser?.email || null;
        const origin = window.location.origin;
        const conversationUrl = `${origin}/chat/${conversationId}`;
        if (recipientEmail) {
          await fetch(emailEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: [recipientEmail],
              template: 'unread_message_notification',
              subject: product?.name ? `Nuevo mensaje · ${product.name}` : 'Nuevo mensaje',
              props: {
                productName: product?.name || '',
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
      adjustTextareaHeight();
      await fetchMessages();
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      alert('Error al enviar el mensaje');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    adjustTextareaHeight();
    
    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 1000);
  };

  // ... existing code ...
  useEffect(() => {
    if (!conversationId) return;

    const subscription = supabase
      .channel(`messages:conversation_id=eq.${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, () => {
        fetchMessages();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [conversationId]);

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        navigate('/login');
        return;
      }
      if (user && user.isVerified === false) {
        alert('Debes verificar tu correo electrónico para chatear')
        navigate('/verificacion-identidad');
        return;
      }

      setLoading(true);
      const userDbId = await fetchCurrentUserDbId();
      if (userDbId) {
        await fetchConversation(userDbId);
        await fetchMessages();
        await markMessagesAsRead(userDbId);
      }
      setLoading(false);
    };

      loadData();
  }, [conversationId, user]);

  useEffect(() => {
    if (!product?.id || !conversation?.buyer_id || !conversation?.seller_id) return;
    fetchOffers(product.id, conversation.buyer_id, conversation.seller_id);
  }, [product?.id, conversation?.buyer_id, conversation?.seller_id]);

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-gray-50 flex flex-col">
        <div className="flex-1 flex flex-col w-full max-w-5xl mx-auto">
          <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-gray-200 pt-[env(safe-area-inset-top)]">
            <div className="px-3 sm:px-4 py-3 sm:py-4 flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gray-200 animate-pulse" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-48 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gray-200 animate-pulse" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-6 py-4 space-y-3 sm:space-y-4">
            <div className="flex justify-start">
              <div className="w-[72%] sm:w-[55%] h-12 bg-white rounded-2xl border border-gray-200 shadow-sm animate-pulse" />
            </div>
            <div className="flex justify-end">
              <div className="w-[58%] sm:w-[45%] h-10 bg-gray-900/10 rounded-2xl border border-gray-200 shadow-sm animate-pulse" />
            </div>
            <div className="flex justify-start">
              <div className="w-[64%] sm:w-[52%] h-10 bg-white rounded-2xl border border-gray-200 shadow-sm animate-pulse" />
            </div>
            <div className="flex justify-end">
              <div className="w-[70%] sm:w-[58%] h-14 bg-gray-900/10 rounded-2xl border border-gray-200 shadow-sm animate-pulse" />
            </div>
            <div className="flex justify-start">
              <div className="w-[52%] sm:w-[40%] h-10 bg-white rounded-2xl border border-gray-200 shadow-sm animate-pulse" />
            </div>
          </div>

          <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur border-t border-gray-200 px-3 sm:px-4 lg:px-6 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <div className="h-11 sm:h-12 bg-gray-100 rounded-2xl border border-gray-200 animate-pulse" />
            <div className="mt-3 h-8 w-56 bg-gray-100 rounded-full animate-pulse mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-8 py-12 bg-white rounded-3xl shadow-2xl border border-gray-100">
          <div className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <svg className="w-14 h-14 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Conversación no encontrada</h3>
          <p className="text-gray-600 mb-8 leading-relaxed">La conversación que buscas no existe o no tienes permisos para acceder a ella.</p>
          <button 
            onClick={() => navigate('/my-chats')}
            className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-medium flex items-center mx-auto space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Volver a mis chats</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col w-full max-w-5xl mx-auto">
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-200 pt-[env(safe-area-inset-top)]">
          <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
            <button
              onClick={() => navigate('/my-chats')}
              className="flex items-center text-gray-700 hover:text-gray-900 transition-all duration-200 group bg-gray-100 hover:bg-gray-200 px-2 sm:px-3 py-2 rounded-xl flex-shrink-0"
            >
              <svg className="w-5 h-5 sm:w-5 sm:h-5 mr-0 sm:mr-2 sm:transform sm:group-hover:-translate-x-1 sm:transition-transform sm:duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline font-medium text-sm">Volver</span>
            </button>

            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-2xl flex items-center justify-center shadow-sm">
                  <span className="text-gray-900 font-bold text-sm sm:text-lg">
                    {otherUser?.nombre?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-gray-300 border-2 border-white rounded-full"></div>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-gray-900 text-base sm:text-lg truncate">{otherUser?.nombre}</h2>
                <button
                  type="button"
                  onClick={() => navigate(`/product/${product?.id}`)}
                  className="mt-0.5 text-left w-full"
                >
                  <span className="inline-flex max-w-full items-center gap-2 text-xs sm:text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-full transition-colors">
                    <svg className="w-3.5 h-3.5 flex-shrink-0 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                    <span className="truncate font-medium">{product?.name}</span>
                  </span>
                </button>
              </div>
            </div>

            <button
              onClick={() => navigate(`/product/${product?.id}`)}
              className="p-2 sm:p-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 bg-gray-100 flex-shrink-0"
              aria-label="Ver producto"
              title="Ver producto"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-6 py-4 space-y-3 sm:space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center py-12 sm:py-16 lg:py-20 px-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gray-100 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-lg">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">¡Inicia la conversación!</h3>
              <p className="text-gray-600 max-w-sm sm:max-w-md mx-auto leading-relaxed text-sm sm:text-base lg:text-lg">No hay mensajes aún. Envía el primer mensaje para comenzar a chatear sobre <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-lg">{product?.name}</span>.</p>
              <div className="mt-6 sm:mt-8 flex justify-center space-x-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          ) : (
            messages.map((message, index) => {
              const isOwn = message.sender_id === currentUserDbId;
              const showAvatar = index === 0 || messages[index - 1].sender_id !== message.sender_id;
              const isLocation = Boolean(parseLocationMessage(message.message));
              
              return (
                <div
                  key={message.id}
                  className={`flex items-end space-x-2 sm:space-x-3 ${isOwn ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                >
                  {!isOwn && showAvatar && (
                    <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gray-500 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 mb-1 shadow-lg">
                      <span className="text-white font-bold text-xs sm:text-sm">
                        {otherUser?.nombre?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  {!isOwn && !showAvatar && <div className="w-8 sm:w-9 lg:w-10"></div>}
                  
                  <div className={`max-w-[82%] sm:max-w-md lg:max-w-lg group ${isOwn ? 'order-1' : ''}`}>
                    <div
                      className={`${isLocation ? 'p-0 overflow-hidden' : 'px-3 sm:px-4 lg:px-5 py-3 sm:py-4'} rounded-2xl sm:rounded-3xl shadow-sm sm:shadow-lg transition-all duration-300 sm:group-hover:shadow-xl sm:transform sm:group-hover:-translate-y-1 ${
                        isOwn
                          ? 'bg-gray-900 text-white rounded-br-md sm:rounded-br-lg'
                          : 'bg-white text-gray-900 border border-gray-100 rounded-bl-md sm:rounded-bl-lg backdrop-blur-sm'
                      }`}
                    >
                      {renderMessageWithButtons(message.message, isOwn)}
                      <div className="flex items-center justify-between mt-2 sm:mt-3">
                        <p
                          className={`text-xs font-medium ${
                            isOwn ? 'text-gray-300' : 'text-gray-500'
                          }`}
                        >
                          {new Date(message.created_at).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        {isOwn && (
                          <div className="flex items-center space-x-1 ml-2">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {isOwn && showAvatar && (
                    <div className="hidden sm:flex w-9 h-9 lg:w-10 lg:h-10 bg-gray-200 rounded-2xl items-center justify-center flex-shrink-0 mb-1 shadow-lg">
                      <span className="text-gray-900 font-bold text-xs sm:text-sm">
                        {user?.nombre?.charAt(0)?.toUpperCase() || 'T'}
                      </span>
                    </div>
                  )}
                  {isOwn && !showAvatar && <div className="hidden sm:block w-9 lg:w-10"></div>}
                </div>
              );
            })
          )}
          
          {isTyping && (
            <div className="flex items-center space-x-2 sm:space-x-3 animate-fadeIn">
              <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gray-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xs sm:text-sm">
                  {otherUser?.nombre?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl px-4 sm:px-6 py-3 sm:py-4 shadow-lg border border-gray-100">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-300 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="sticky bottom-0 z-20 bg-white/90 backdrop-blur border-t border-gray-200/60 px-3 sm:px-4 lg:px-6 pt-3 sm:pt-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-4 sm:mx-4 sm:mb-4 sm:rounded-2xl sm:border sm:border-gray-200/60 sm:shadow-lg">
          <div className="flex items-end space-x-2 sm:space-x-3 lg:space-x-4 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={newMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                className="w-full border-2 border-gray-200 rounded-2xl sm:rounded-3xl px-4 sm:px-5 lg:px-6 py-3 sm:py-4 pr-12 sm:pr-14 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl min-h-[48px] sm:min-h-[56px] max-h-[100px] sm:max-h-[120px] font-medium placeholder-gray-400 text-sm sm:text-base"
                rows={1}
                disabled={sending || (user && user.isVerified === false)}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              />
              <div className="absolute right-3 sm:right-4 bottom-3 sm:bottom-4 text-gray-400">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
            </div>

            <button
              onClick={handleCounterOffer}
              disabled={sending}
              className="bg-white text-gray-900 border border-gray-300 p-3 sm:p-4 rounded-2xl sm:rounded-3xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span className="hidden sm:inline font-medium">Contraoferta</span>
              <span className="sm:hidden">💰</span>
            </button>

            <button
              onClick={() => {
                if (!navigator.geolocation) {
                  alert('Tu dispositivo no soporta ubicación');
                  return;
                }
                navigator.geolocation.getCurrentPosition(
                  (pos) => {
                    const { latitude, longitude } = pos.coords;
                    sendMessage(`[[LOCATION:${latitude},${longitude}]]`);
                  },
                  () => {
                    alert('No se pudo obtener tu ubicación');
                  },
                  { enableHighAccuracy: true, timeout: 10000 }
                );
              }}
              disabled={sending}
              className="bg-white text-gray-900 border border-gray-300 p-3 sm:p-4 rounded-2xl sm:rounded-3xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center min-w-[48px] sm:min-w-[56px]"
              aria-label="Compartir ubicación"
              title="Compartir ubicación"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11a3 3 0 100-6 3 3 0 000 6z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 10.5c0 7.5-7.5 12-7.5 12s-7.5-4.5-7.5-12a7.5 7.5 0 1115 0z" />
              </svg>
            </button>
            
            <button
              onClick={sendMessage}
              disabled={sending || !newMessage.trim() || (user && user.isVerified === false)}
              className="bg-gray-900 text-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none flex items-center justify-center min-w-[48px] sm:min-w-[56px]"
            >
              {sending ? (
                <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent"></div>
              ) : (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
          
          <div className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4 text-center font-medium bg-gray-50 px-3 sm:px-4 py-2 rounded-full mx-auto max-w-xs sm:max-w-md">
            <span className="inline-flex items-center space-x-1 sm:space-x-2">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="hidden sm:inline">Enter para enviar • Shift+Enter para nueva línea</span>
              <span className="sm:hidden">Enter para enviar</span>
            </span>
          </div>
          
          <div className="mt-3 sm:mt-4 flex gap-2 sm:gap-3 overflow-x-auto sm:overflow-visible pb-1 sm:pb-0 sm:flex-wrap justify-start sm:justify-center">
            <button
              onClick={() => sendMessage('¿Sigue disponible?')}
              disabled={sending}
              className="flex-shrink-0 px-3 py-2 text-sm rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200"
            >
              ¿Sigue disponible?
            </button>
            <button
              onClick={() => sendMessage('¿Aceptas ofertas?')}
              disabled={sending}
              className="flex-shrink-0 px-3 py-2 text-sm rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200"
            >
              ¿Aceptas ofertas?
            </button>
            <button
              onClick={() => sendMessage('¿Dónde podemos encontrarnos?')}
              disabled={sending}
              className="flex-shrink-0 px-3 py-2 text-sm rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200"
            >
              ¿Dónde podemos encontrarnos?
            </button>
            <button
              onClick={() => sendMessage('¿Cuál es tu precio mínimo?')}
              disabled={sending}
              className="flex-shrink-0 px-3 py-2 text-sm rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200"
            >
              ¿Cuál es tu precio mínimo?
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ChatPage;
