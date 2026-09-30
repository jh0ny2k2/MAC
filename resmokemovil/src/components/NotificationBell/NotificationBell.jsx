import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";

const NotificationBell = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  
  const [showCounterOfferModal, setShowCounterOfferModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [counterOfferData, setCounterOfferData] = useState({
    amount: '',
    message: ''
  });
  const [counterOfferLoading, setCounterOfferLoading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (user) {
      loadNotifications();
      setupRealtimeSubscription();
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;
    try {
      setLoading(true);

      let { data: userData, error: userError } = await supabase
        .from("Users")
        .select("*")
        .eq("google_id", user.id)
        .limit(1)
        .maybeSingle();

      if (userError || !userData) {
        let { data: userByEmail } = await supabase
          .from("Users")
          .select("*")
          .eq("email", user.email)
          .limit(1)
          .maybeSingle();
        userData = userByEmail;
      }

      const { data: counterOffers, error: counterOffersError } = await supabase
        .from("counter_offers")
        .select("*")
        .or(`receiver_id.eq.${userData.id},and(sender_id.eq.${userData.id},status.eq.notification)`)
        .order("created_at", { ascending: false })
        .limit(10);

      const { data: appNotifications, error: appNotificationsError } = await supabase
        .from("notifications")
        .select("*")
        .eq("receiver_id", userData.id)
        .order("created_at", { ascending: false })
        .limit(20);

      const enrichedOffers = await Promise.all(
        (counterOffers || []).map(async (offer) => {
          const { data: senderData } = await supabase
            .from("Users")
            .select("*")
            .eq("id", offer.sender_id)
            .limit(1)
            .maybeSingle();

          const { data: productData } = await supabase
            .from("products")
            .select("*")
            .eq("id", offer.product_id)
            .limit(1)
            .maybeSingle();

          return {
            ...offer,
            sender: senderData,
            product: productData,
            kind: "counter_offer",
          };
        })
      );

      const appEnriched = await Promise.all(
        (appNotifications || []).map(async (notif) => {
          const productId = notif?.metadata?.product_id || null;
          const senderId = notif?.metadata?.sender_id || null;

          const [{ data: productData }, { data: senderData }] = await Promise.all([
            productId
              ? supabase.from("products").select("*").eq("id", productId).limit(1).maybeSingle()
              : Promise.resolve({ data: null }),
            senderId
              ? supabase.from("Users").select("*").eq("id", senderId).limit(1).maybeSingle()
              : Promise.resolve({ data: null }),
          ]);

          return {
            ...notif,
            kind: "app",
            product: productData,
            sender: senderData,
          };
        })
      );

      let unreadMessagesCount = 0;
      try {
        const { data: conversations, error: convError } = await supabase
          .from("conversations")
          .select("id")
          .or(`buyer_id.eq.${userData.id},seller_id.eq.${userData.id}`);

        if (!convError && conversations && conversations.length > 0) {
          const conversationIds = conversations.map((c) => c.id);
          const { count, error: countError } = await supabase
            .from("messages")
            .select("*", { count: "exact", head: true })
            .neq("sender_id", userData.id)
            .eq("is_read", false)
            .in("conversation_id", conversationIds);

          if (!countError) unreadMessagesCount = count || 0;
        }
      } catch (e) {
      }

      const synthetic = unreadMessagesCount > 0 ? [{
        id: "unread-messages",
        kind: "synthetic",
        type: "unread_messages",
        title: "Mensajes sin leer",
        message: `Tienes ${unreadMessagesCount} mensaje(s) sin leer.`,
        link_url: "/my-chats",
        is_read: false,
        created_at: new Date().toISOString(),
      }] : [];

      if (counterOffersError) {
        setNotifications([...synthetic, ...appEnriched]);
        setUnreadCount(
          [...synthetic, ...appEnriched].filter((n) => !n.is_read).length
        );
        return;
      }

      if (appNotificationsError) {
        setNotifications([...synthetic, ...enrichedOffers]);
        setUnreadCount(
          [...synthetic, ...enrichedOffers].filter((n) => !n.is_read).length
        );
        return;
      }

      const all = [...synthetic, ...appEnriched, ...enrichedOffers].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setNotifications(all);
      setUnreadCount(all.filter((n) => !n.is_read).length);
    } catch (error) {
      console.error("Error en loadNotifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!user) return;
    const subscription = supabase
      .channel("counter_offers_notifications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "counter_offers" },
        () => {
          loadNotifications();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        () => {
          loadNotifications();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        () => {
          loadNotifications();
        }
      )
      .subscribe();

    return () => subscription.unsubscribe();
  };

  const markAsRead = async (notification) => {
    try {
      if (notification.kind === "counter_offer") {
        await supabase.from("counter_offers").update({ is_read: true }).eq("id", notification.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
        return;
      }

      if (notification.kind === "app") {
        await supabase.from("notifications").update({ is_read: true }).eq("id", notification.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error marcando como leída:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const counterOfferIds = notifications.filter((n) => n.kind === "counter_offer").map((n) => n.id);
      const appIds = notifications.filter((n) => n.kind === "app").map((n) => n.id);

      await Promise.all([
        counterOfferIds.length > 0 ? supabase.from("counter_offers").update({ is_read: true }).in("id", counterOfferIds) : Promise.resolve(),
        appIds.length > 0 ? supabase.from("notifications").update({ is_read: true }).in("id", appIds) : Promise.resolve(),
      ]);

      setNotifications((prev) => prev.map((n) => (n.kind === "synthetic" ? n : ({ ...n, is_read: true }))));
      setUnreadCount(notifications.filter((n) => n.kind === "synthetic" && !n.is_read).length);
    } catch (error) {
      console.error("Error al marcar todas como leídas:", error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      markAsRead(notification);
    }
    if (notification.kind === "counter_offer") {
      window.location.href = `/product/${notification.product_id}`;
      return;
    }

    if (notification.link_url) {
      window.location.href = notification.link_url;
      return;
    }

    if (notification.kind === "app" && notification?.metadata?.product_id) {
      window.location.href = `/product/${notification.metadata.product_id}`;
    }
  };

  const respondToCounterOffer = async (offerId, response) => {
    try {
      const status = response === "accept" ? "accepted" : "rejected";
      
      const { data: counterOffer, error: offerError } = await supabase
        .from("counter_offers")
        .select(`
          *,
          sender:Users!sender_id(id, nombre, email, telefono),
          receiver:Users!receiver_id(id, nombre, email, telefono),
          product:products!product_id(id, user_id, name)
        `)
        .eq("id", offerId)
        .single();

      if (offerError) throw offerError;

      await supabase.from("counter_offers").update({ status }).eq("id", offerId);
      
      if (response === "accept") {
        const productOwnerId = counterOffer.product.user_id;
        const buyerId = counterOffer.sender_id === productOwnerId ? counterOffer.receiver_id : counterOffer.sender_id;
        const buyerInfo = counterOffer.sender_id === productOwnerId ? counterOffer.receiver : counterOffer.sender;

        if (!buyerInfo) {
          throw new Error('No se pudo obtener la información del comprador');
        }

        const { error: productError } = await supabase
          .from("products")
          .update({
            status: 'sold',
            sold_date: new Date().toISOString(),
            buyer_user_id: buyerId,
            buyer_name: buyerInfo.nombre || 'Usuario',
            buyer_email: buyerInfo.email || '',
            sale_price: counterOffer.amount
          })
          .eq("id", counterOffer.product_id);

        if (productError) throw productError;

        try {
          const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
          const emailEndpoint = isLocal ? 'http://localhost:3001/api/email/send' : '/.netlify/functions/email-send';
          const productOwnerId = counterOffer.product.user_id;
          const sellerInfo = counterOffer.sender_id === productOwnerId ? counterOffer.sender : counterOffer.receiver;
          const buyerInfo = sellerInfo === counterOffer.sender ? counterOffer.receiver : counterOffer.sender;
          const sellerEmail = sellerInfo?.email || '';
          const buyerEmail = buyerInfo?.email || '';
          const recipients = [buyerEmail].filter(Boolean);
          await fetch(emailEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: recipients,
              template: 'counter_offer_accepted',
              subject: `Contraoferta aceptada · ${counterOffer.product.name}`,
              props: {
                productName: counterOffer.product.name,
                amount: Number(counterOffer.amount).toLocaleString('es-ES'),
                sellerName: sellerInfo?.nombre || '',
                buyerName: buyerInfo?.nombre || '',
                uploaderEmail: sellerEmail,
              },
            }),
          });
        } catch (e) {
          console.error('Error enviando email de contraoferta aceptada:', e);
        }
      }

      const responseMessage = response === "accept" 
        ? `Tu contraoferta de $${counterOffer.amount} por "${counterOffer.product.name}" ha sido ACEPTADA`
        : `Tu contraoferta de $${counterOffer.amount} por "${counterOffer.product.name}" ha sido RECHAZADA`;

      await supabase
        .from('counter_offers')
        .insert({
          product_id: counterOffer.product_id,
          sender_id: counterOffer.receiver_id,
          receiver_id: counterOffer.sender_id,
          amount: counterOffer.amount,
          message: responseMessage,
          status: 'notification',
          is_read: false
        });
      
      loadNotifications();
      alert(`Contraoferta ${status === "accepted" ? "aceptada" : "rechazada"} exitosamente${response === "accept" ? ". El producto ha sido marcado como vendido." : ""}`);
    } catch (error) {
      console.error("Error respondiendo contraoferta:", error);
      alert("Error al procesar la respuesta. Inténtalo de nuevo.");
    }
  };

  const openCounterOfferModal = (notification) => {
    setSelectedNotification(notification);
    setShowCounterOfferModal(true);
  };

  const closeCounterOfferModal = () => {
    setShowCounterOfferModal(false);
    setSelectedNotification(null);
    setCounterOfferData({
      amount: '',
      message: ''
    });
  };

  const handleCounterOfferSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !selectedNotification) {
      alert('Error: No se puede procesar la contraoferta');
      return;
    }

    if (!counterOfferData.amount) {
      alert('Por favor ingresa el monto de la contraoferta');
      return;
    }

    setCounterOfferLoading(true);

    try {
      let { data: userData, error: userError } = await supabase
        .from("Users")
        .select("*")
        .eq("google_id", user.id)
        .limit(1)
        .maybeSingle();

      if (userError || !userData) {
        let { data: userByEmail } = await supabase
          .from("Users")
          .select("*")
          .eq("email", user.email)
          .limit(1)
          .maybeSingle();
        userData = userByEmail;
      }

      if (!userData) {
        throw new Error('Usuario no encontrado');
      }

      const { error: counterOfferError } = await supabase
        .from('counter_offers')
        .insert({
          product_id: selectedNotification.product_id,
          sender_id: userData.id,
          receiver_id: selectedNotification.sender_id,
          amount: parseFloat(counterOfferData.amount),
          message: counterOfferData.message || null,
          status: 'pending',
          is_read: false
        });

      if (counterOfferError) throw counterOfferError;

      alert('Contraoferta enviada exitosamente');
      try {
        const { data: receiverData } = await supabase
          .from('Users')
          .select('email, nombre')
          .eq('id', selectedNotification.sender_id)
          .single();
        const receiverEmail = receiverData?.email || null;
        const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
        const emailEndpoint = isLocal ? 'http://localhost:3001/api/email/send' : '/.netlify/functions/email-send';
        const origin = window.location.origin;
        const productUrl = `${origin}/product/${selectedNotification.product_id}`;
        if (receiverEmail) {
          await fetch(emailEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: [receiverEmail],
              template: 'counter_offer_received',
              subject: `Nueva contraoferta · ${selectedNotification.product?.name || ''}`,
              props: {
                productName: selectedNotification.product?.name || '',
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
      closeCounterOfferModal();
      
    } catch (error) {
      console.error('Error enviando contraoferta:', error);
      alert('Error al enviar la contraoferta. Inténtalo de nuevo.');
    } finally {
      setCounterOfferLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    if (diffInMinutes < 1) return "Ahora";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "accepted":
        return "Aceptada";
      case "rejected":
        return "Rechazada";
      case "notification":
        return "Notificación";
      default:
        return status;
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        aria-label="Notificaciones"
        title="Notificaciones"
        className="relative p-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg className={`w-5 h-5 ${unreadCount > 0 ? "text-gray-900" : "text-gray-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        {unreadCount > 0 && (
          <>
            <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-red-400 opacity-60 animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full ring-2 ring-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </>
        )}
      </button>

      {isOpen && (
        <div
          className="fixed inset-x-4 top-16 sm:absolute sm:right-0 sm:mt-3 sm:top-auto sm:left-auto sm:w-96 bg-white/95 backdrop-blur-xl shadow-xl rounded-2xl border border-gray-100/80 z-50 overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-900" />
              <h3 className="text-sm font-semibold text-gray-900">Notificaciones</h3>
              {unreadCount > 0 && (
                <span className="text-[11px] font-medium text-gray-400">({unreadCount})</span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                Marcar todas
              </button>
            )}
          </div>

          <div className="max-h-[70vh] sm:max-h-96 overflow-y-auto p-3 space-y-2">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-6 h-6 rounded-full border-2 border-gray-200 border-t-gray-900 animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                  </svg>
                </div>
                <p className="text-sm text-gray-400 font-medium">No tienes notificaciones</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 rounded-xl transition-all duration-150 cursor-pointer ${
                    !notification.is_read
                      ? "bg-gray-50 border border-gray-100 shadow-sm"
                      : "hover:bg-gray-50 border border-transparent"
                  }`}
                >
                  {notification.kind === "app" || notification.kind === "synthetic" ? (
                    <>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            notification.type === "product_approved"
                              ? "bg-emerald-50"
                              : notification.type === "product_rejected"
                              ? "bg-red-50"
                              : notification.type === "unread_messages"
                              ? "bg-gray-100"
                              : "bg-gray-100"
                          }`}>
                            <svg className={`w-4 h-4 ${
                              notification.type === "product_approved"
                                ? "text-emerald-600"
                                : notification.type === "product_rejected"
                                ? "text-red-500"
                                : "text-gray-500"
                            }`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              {notification.type === "product_approved" ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              ) : notification.type === "product_rejected" ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              )}
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <p className={`text-sm truncate ${!notification.is_read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                              {notification.title || "Notificación"}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                              {notification.message || ""}
                            </p>
                            {notification.product?.name && (
                              <p className="text-[11px] text-gray-400 mt-1 truncate">
                                {notification.product.name}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <span className="text-[11px] text-gray-400 whitespace-nowrap">
                            {formatTimeAgo(notification.created_at)}
                          </span>
                          {!notification.is_read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                          )}
                        </div>
                      </div>

                      <div className="mt-2 flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide ${
                          notification.type === "product_approved"
                            ? "bg-emerald-50 text-emerald-700"
                            : notification.type === "product_rejected"
                            ? "bg-red-50 text-red-700"
                            : notification.type === "unread_messages"
                            ? "bg-gray-100 text-gray-700"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {notification.type === "product_approved"
                            ? "Aprobado"
                            : notification.type === "product_rejected"
                            ? "Rechazado"
                            : notification.type === "unread_messages"
                            ? "Chats"
                            : "Notificación"}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-sm font-bold text-gray-600">
                            {(notification.sender?.nombre ||
                              notification.sender?.full_name ||
                              "U")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {notification.sender?.nombre ||
                                notification.sender?.full_name ||
                                "Usuario"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {notification.sender?.email || ""}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <span className="text-[11px] text-gray-400">
                            {formatTimeAgo(notification.created_at)}
                          </span>
                          {!notification.is_read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                          )}
                        </div>
                      </div>

                      <div className="mb-3">
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">
                          {notification.product?.name ||
                            `Producto #${notification.product?.id}`}
                        </h4>
                        
                        {notification.status === "notification" && notification.message ? (
                          <p className="text-xs text-gray-600 bg-gray-50 rounded-lg p-2.5 leading-relaxed">
                            {notification.message}
                          </p>
                        ) : (
                          <div className="space-y-0.5 text-xs text-gray-500">
                            <p className="line-clamp-2">{notification.product?.description || ""}</p>
                            {notification.product?.price && (
                              <p><span className="font-medium text-gray-600">Precio:</span> ${parseFloat(notification.product.price).toLocaleString("es-CO")}</p>
                            )}
                            {notification.amount && (
                              <p><span className="font-medium text-gray-600">Oferta:</span> ${parseFloat(notification.amount).toLocaleString("es-CO")}</p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide ${
                          notification.status === "pending"
                            ? "bg-amber-50 text-amber-700"
                            : notification.status === "accepted"
                            ? "bg-emerald-50 text-emerald-700"
                            : notification.status === "rejected"
                            ? "bg-red-50 text-red-700"
                            : notification.status === "notification"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {getStatusText(notification.status)}
                        </span>

                        {notification.status === "pending" && (
                          <div className="flex items-center gap-1.5">
                            <button
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                respondToCounterOffer(notification.id, "accept");
                              }}
                            >
                              Aceptar
                            </button>
                            <button
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition-all shadow-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                respondToCounterOffer(notification.id, "reject");
                              }}
                            >
                              Rechazar
                            </button>
                            <button
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-all shadow-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                openCounterOfferModal(notification);
                              }}
                            >
                              Contraofertar
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {showCounterOfferModal && selectedNotification && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-100">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Realizar contraoferta</h2>
                    <p className="text-sm text-gray-500">Propón un nuevo precio para este producto</p>
                  </div>
                </div>
                <button
                  onClick={closeCounterOfferModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-lg hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  {selectedNotification.product?.name}
                </h3>
                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Precio original</span>
                    <span className="font-medium text-gray-700">${selectedNotification.product?.price ? parseFloat(selectedNotification.product.price).toLocaleString("es-CO") : "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Oferta actual</span>
                    <span className="font-medium text-gray-700">${selectedNotification.amount ? parseFloat(selectedNotification.amount).toLocaleString("es-CO") : "N/A"}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleCounterOfferSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 tracking-wide uppercase">Tu nueva oferta</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-gray-400 text-sm font-semibold">$</span>
                    </div>
                    <input
                      type="number"
                      value={counterOfferData.amount}
                      onChange={(e) => setCounterOfferData(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all bg-white"
                      required
                      min="1"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 tracking-wide uppercase">Mensaje (opcional)</label>
                  <textarea
                    value={counterOfferData.message}
                    onChange={(e) => setCounterOfferData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Agrega un mensaje para el vendedor..."
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all bg-white resize-none"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeCounterOfferModal}
                    disabled={counterOfferLoading}
                    className="flex-1 px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={counterOfferLoading || !counterOfferData.amount}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    {counterOfferLoading ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Enviar contraoferta
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
