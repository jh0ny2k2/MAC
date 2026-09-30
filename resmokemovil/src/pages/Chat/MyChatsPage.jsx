import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Layout/HeaderProducts';
import Footer from '../../components/Layout/Footer';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ChatModal = ({ isOpen, onClose, conversationId, otherUser, product, variant = 'modal' }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUserDbId, setCurrentUserDbId] = useState(null);

  const renderMessageContent = (text, isOwn) => {
    const locationTokenMatch = String(text || '').match(/\[\[LOCATION:([-0-9.]+),([-0-9.]+)\]\]/);
    if (locationTokenMatch) {
      const lat = Number.parseFloat(locationTokenMatch[1]);
      const lng = Number.parseFloat(locationTokenMatch[2]);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return <p className="text-sm break-words font-medium">{text}</p>;
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
          <div className={`p-3 ${isOwn ? 'text-white' : 'text-gray-900'}`}>
            <div className="text-sm font-semibold">Ubicación compartida</div>
            <div className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-600'}`}>{lat}, {lng}</div>
            <div className={`text-xs mt-2 underline ${isOwn ? 'text-white' : 'text-gray-700'}`}>Abrir en Google Maps</div>
          </div>
        </button>
      );
    }

    const urlMatch = String(text || '').match(/https?:\/\/(www\.)?maps\.google\.[^ \n]+/i) || String(text || '').match(/https?:\/\/(www\.)?google\.[^ \n]+\/maps[^ \n]*/i);
    if (urlMatch && String(text || '').toLowerCase().includes('ubicaci')) {
      const url = urlMatch[0];
      return (
        <button
          type="button"
          onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
          className={`w-full text-left rounded-2xl p-3 border transition-colors ${
            isOwn ? 'border-white/20 bg-white/10 hover:bg-white/15' : 'border-gray-200 bg-white hover:bg-gray-50'
          }`}
        >
          <div className={`text-sm font-semibold ${isOwn ? 'text-white' : 'text-gray-900'}`}>Ubicación compartida</div>
          <div className={`text-xs mt-2 underline ${isOwn ? 'text-white' : 'text-gray-700'}`}>Abrir en Google Maps</div>
        </button>
      );
    }

    return <p className="text-sm break-words font-medium">{text}</p>;
  };

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

  const fetchMessages = async () => {
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

  const sendMessage = async (textOverride) => {
    const outgoing = typeof textOverride === 'string' ? textOverride : newMessage;
    if (!outgoing.trim() || !currentUserDbId || !conversationId) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: currentUserDbId,
          message: outgoing.trim(),
          is_read: false
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
      await fetchMessages();
    } catch (error) {
      console.error('Error enviando mensaje:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const markModalMessagesAsRead = async () => {
    if (!currentUserDbId || !conversationId) return;
    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', currentUserDbId)
        .eq('is_read', false);
    } catch (error) {
      console.error('Error marcando mensajes como leídos en modal:', error);
    }
  };

  useEffect(() => {
    if (isOpen && conversationId) {
      const loadData = async () => {
        const userDbId = await fetchCurrentUserDbId();
        if (userDbId) {
          await fetchMessages();
          await markModalMessagesAsRead();
        }
      };
      loadData();

      const subscription = supabase
        .channel(`messages-${conversationId}`)
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
    }
  }, [isOpen, conversationId, currentUserDbId]);

  if (!isOpen) return null;

  const isInline = variant === 'inline';

  const renderShell = (children) => {
    if (isInline) {
      return <div className="h-full flex flex-col">{children}</div>;
    }
    return (
      <>
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300" onClick={onClose} />
        <div className="fixed right-0 top-0 m-2 h-full w-[400px] bg-white/95 backdrop-blur-lg shadow-2xl border border-gray-200 z-50 transform transition-transform duration-300 flex flex-col rounded-3xl overflow-hidden">
          {children}
        </div>
      </>
    );
  };

  return renderShell(
    <>
      <div className={`${isInline ? 'bg-white border-b border-gray-100 px-5 py-4' : 'p-6 flex items-center justify-between shadow-sm'}`}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-white font-bold text-sm">
              {otherUser?.nombre?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>
          <div className="min-w-0">
            <h3 className={`font-semibold truncate ${isInline ? 'text-gray-900 text-sm' : 'text-lg'}`}>
              {otherUser?.nombre || 'Usuario'}
            </h3>
            <p className={`text-sm truncate ${isInline ? 'text-gray-400' : 'text-gray-500'}`}>
              {product?.name || 'Producto'}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-all duration-200 p-1.5 rounded-lg hover:bg-gray-100"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className={`flex-1 overflow-y-auto ${isInline ? 'px-5 py-5 space-y-3 bg-gray-50/50' : 'p-6 space-y-4 bg-gray-50/50'}`}>
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-gray-800 font-semibold mb-1">¡Inicia la conversación!</p>
            <p className="text-sm text-gray-500">Envía el primer mensaje sobre <span className="font-medium text-gray-700">{product?.name}</span></p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.sender_id === currentUserDbId;
            const bubbleBase = String(message.message || '').includes('[[LOCATION:') ? 'p-0 overflow-hidden' : 'px-4 py-2.5';
            const bubbleClass = isOwn
              ? 'bg-gray-800 text-white rounded-2xl rounded-tr-md shadow-sm'
              : 'bg-white text-gray-900 border border-gray-200/60 rounded-2xl rounded-tl-md shadow-sm';

            return (
              <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[78%] ${bubbleBase} ${bubbleClass}`}>
                  {renderMessageContent(message.message, isOwn)}
                  <p className={`text-[11px] mt-1.5 font-medium ${isOwn ? 'text-gray-400' : 'text-gray-400'}`}>
                    {formatTime(message.created_at)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className={`border-t border-gray-100 px-5 py-4 bg-white`}>
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
            placeholder="Escribe tu mensaje..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all bg-gray-50/50"
            disabled={loading}
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
                  sendMessage(`[[LOCATION:${latitude},${longitude}]]`);
                },
                () => {
                  alert('No se pudo obtener tu ubicación');
                },
                { enableHighAccuracy: true, timeout: 10000 }
              );
            }}
            disabled={loading}
            className="bg-white hover:bg-gray-50 disabled:bg-gray-100 text-gray-500 p-2.5 rounded-xl transition-all border border-gray-200"
            aria-label="Compartir ubicación"
            title="Compartir ubicación"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11a3 3 0 100-6 3 3 0 000 6z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 10.5c0 7.5-7.5 12-7.5 12s-7.5-4.5-7.5-12a7.5 7.5 0 1115 0z" />
            </svg>
          </button>
          <button
            onClick={sendMessage}
            disabled={loading || !newMessage.trim()}
            className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white p-2.5 rounded-xl transition-all shadow-sm"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

const MyChatsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserDbId, setCurrentUserDbId] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

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

  const fetchConversations = async (userDbId) => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          products (id, name, main_image, price),
          buyer:buyer_id (id, nombre, email),
          seller:seller_id (id, nombre, email),
          last_message:messages (message, created_at, sender_id)
        `)
        .or(`buyer_id.eq.${userDbId},seller_id.eq.${userDbId}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const conversationsWithLastMessage = await Promise.all(
        (data || []).map(async (conv) => {
          const { data: lastMessage } = await supabase
            .from('messages')
            .select('message, created_at, sender_id')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .neq('sender_id', userDbId)
            .eq('is_read', false);

          return {
            ...conv,
            lastMessage,
            unreadCount: unreadCount || 0,
            otherUser: conv.buyer_id === userDbId ? conv.seller : conv.buyer
          };
        })
      );

      setConversations(conversationsWithLastMessage);
    } catch (error) {
      console.error('Error obteniendo conversaciones:', error);
    }
  };

  const markMessagesAsRead = async (conversationId) => {
    if (!currentUserDbId || !conversationId) return;
    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', currentUserDbId)
        .eq('is_read', false);
      
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      );
    } catch (error) {
      console.error('Error marcando mensajes como leídos:', error);
    }
  };

  const handleConversationClick = async (conversation) => {
    await markMessagesAsRead(conversation.id);
    if (window.innerWidth < 768) {
      navigate(`/chat/${conversation.id}`);
    } else {
      setSelectedChat(conversation);
      setIsChatModalOpen(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Hoy';
    } else if (diffDays === 2) {
      return 'Ayer';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} días`;
    } else {
      return date.toLocaleDateString('es-ES');
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/img/resmoke/noFoto.png';
    if (imagePath.startsWith('http')) return imagePath;
    const { data } = supabase.storage.from('product-images').getPublicUrl(imagePath);
    return data.publicUrl;
  };

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      setLoading(true);
      const userDbId = await fetchCurrentUserDbId();
      if (userDbId) {
        await fetchConversations(userDbId);
      }
      setLoading(false);
    };

    loadData();

    let subscription;
    if (user && currentUserDbId) {
      subscription = supabase
        .channel('messages-updates')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'messages'
        }, () => {
          fetchConversations(currentUserDbId);
        })
        .on('postgres_changes', {
          event: '*',
          schema: 'public', 
          table: 'conversations'
        }, () => {
          fetchConversations(currentUserDbId);
        })
        .subscribe();
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [user, currentUserDbId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
        <Footer />
      </div>
    );
  }

  const filteredConversations = conversations.filter(c => {
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery = !q || (c.otherUser?.nombre?.toLowerCase().includes(q) || c.products?.name?.toLowerCase().includes(q));
    const matchesFilter = activeFilter === 'all' || (c.unreadCount > 0);
    return matchesQuery && matchesFilter;
  });

  const unreadTotal = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50/60">
      <Header />

      {/* Hero Banner */}
      <div className="relative">
        <div className="h-28 sm:h-36 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent" />
          <div className="absolute top-0 right-0 w-72 h-72 bg-gray-200/30 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-gray-200/30 rounded-full translate-y-1/3 -translate-x-1/4" />
        </div>
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full pb-4 sm:pb-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Mis chats</h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{conversations.length} conversación{conversations.length !== 1 ? 'es' : ''}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-3 sm:-mt-4 relative z-10 pb-12">
        {/* Search + Filter bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100/80 shadow-sm p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar chats..."
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all bg-white"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all ${
                  activeFilter === 'all' ? 'bg-gray-900 text-white shadow-sm' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setActiveFilter('unread')}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all inline-flex items-center gap-1.5 ${
                  activeFilter === 'unread' ? 'bg-gray-900 text-white shadow-sm' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                No leídos
                {unreadTotal > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    activeFilter === 'unread' ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'
                  }`}>
                    {unreadTotal > 9 ? '9+' : unreadTotal}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Dual pane layout */}
        <div className="mt-4 lg:grid lg:grid-cols-12 lg:gap-5">
          {/* Left: Chat list */}
          <div className="lg:col-span-5">
            {filteredConversations.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {searchQuery || activeFilter === 'unread' ? 'No se encontraron chats' : 'No tienes chats aún'}
                </h3>
                <p className="text-sm text-gray-500">
                  {searchQuery || activeFilter === 'unread' ? 'Prueba con otros filtros.' : 'Cuando escribas a alguien, aparecerán aquí.'}
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
                {filteredConversations.map((conversation) => {
                  const lastMessageText = conversation.lastMessage?.message || '';
                  const isOwnLast = conversation.lastMessage?.sender_id === currentUserDbId;
                  const displayTime = conversation.lastMessage ? formatDate(conversation.lastMessage.created_at) : '';
                  const unreadCount = conversation.unreadCount || 0;

                  return (
                    <div
                      key={conversation.id}
                      onClick={() => handleConversationClick(conversation)}
                      className={`px-4 sm:px-5 py-3.5 hover:bg-gray-50 active:bg-gray-50 cursor-pointer transition-all duration-150 ${
                        selectedChat?.id === conversation.id ? 'bg-gray-50 border-l-2 border-l-gray-900' : 'border-l-2 border-l-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center shadow-sm">
                            <span className="text-white font-bold text-sm">
                              {conversation.otherUser?.nombre?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                          </div>
                          {unreadCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-gray-900 text-white text-[10px] font-bold flex items-center justify-center shadow-sm border-2 border-white">
                              {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className={`text-sm truncate ${unreadCount > 0 ? 'font-bold text-gray-900' : 'font-semibold text-gray-900'}`}>
                              {conversation.otherUser?.nombre || 'Usuario desconocido'}
                            </h3>
                            <span className={`text-[11px] font-medium shrink-0 ${unreadCount > 0 ? 'text-gray-900' : 'text-gray-400'}`}>
                              {displayTime}
                            </span>
                          </div>

                          <div className="mt-0.5 flex items-center justify-between gap-2">
                            <p className={`text-sm truncate ${unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                              {lastMessageText ? (
                                <>
                                  <span className={isOwnLast ? 'text-gray-400' : ''}>{isOwnLast ? 'Tú: ' : ''}</span>
                                  {lastMessageText}
                                </>
                              ) : (
                                <span className="text-gray-400">Sin mensajes aún</span>
                              )}
                            </p>
                          </div>

                          <p className="mt-0.5 text-xs text-gray-400 truncate flex items-center gap-1">
                            <span className="inline-block w-3.5 h-3.5 rounded border border-gray-200 overflow-hidden shrink-0">
                              <img
                                src={getImageUrl(conversation.products?.main_image)}
                                alt=""
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            </span>
                            {conversation.products?.name || 'Producto'} · €{conversation.products?.price || '0'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Chat pane (desktop only) */}
          <div className="hidden lg:block lg:col-span-7">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-[calc(100vh-320px)] min-h-[560px]">
              {selectedChat ? (
                <ChatModal
                  isOpen={true}
                  onClose={() => setSelectedChat(null)}
                  conversationId={selectedChat?.id}
                  otherUser={selectedChat?.otherUser}
                  product={selectedChat?.products}
                  variant="inline"
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center max-w-sm px-8">
                    <div className="w-20 h-20 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-5">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Selecciona un chat</h3>
                    <p className="text-sm text-gray-500">Elige una conversación de la lista para ver los mensajes.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal (mobile) */}
      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        conversationId={selectedChat?.id}
        otherUser={selectedChat?.otherUser}
        product={selectedChat?.products}
      />

      <Footer />
    </div>
  );
};

export default MyChatsPage;
