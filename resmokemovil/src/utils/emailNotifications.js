import emailjs from '@emailjs/browser';
import { supabase } from '../lib/supabase';

// Configuración de EmailJS
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
// Template para recuperación de contraseña (ya existente)
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
// Template específico para notificaciones de productos (crear en EmailJS)
const EMAILJS_TEMPLATE_PRODUCT_NOTIFICATION = import.meta.env.VITE_EMAILJS_TEMPLATE_PRODUCT_NOTIFICATION;

/**
 * Función principal para enviar notificaciones de productos
 * @param {string} action - 'approved' o 'rejected'
 * @param {Object} productData - Datos del producto
 * @param {Object} userData - Datos del usuario
 * @param {string} reason - Razón del rechazo (solo para rejected)
 * @returns {Promise<boolean>} - True si el email se envió correctamente
 */
export const sendProductNotification = async (action, productData, userData, reason = '') => {
  try {
    if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_PRODUCT_NOTIFICATION) return false;
    // Inicializar EmailJS
    emailjs.init(EMAILJS_PUBLIC_KEY);

    // Configurar parámetros según el tipo de acción
    const templateParams = buildTemplateParams(action, productData, userData, reason);

    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_PRODUCT_NOTIFICATION,
      templateParams
    );

    console.log(`Email de ${action} enviado exitosamente:`, result);
    return true;
  } catch (error) {
    console.error(`Error enviando email de ${action}:`, error);
    return false;
  }
};

export const createInAppNotification = async ({ receiverId, title, message, linkUrl = null, type = 'general', metadata = null }) => {
  try {
    const payload = {
      receiver_id: receiverId,
      type,
      title,
      message,
      link_url: linkUrl,
      metadata,
      is_read: false
    };

    const { error } = await supabase.from('notifications').insert(payload);
    if (error) throw error;
    return true;
  } catch (error) {
    return false;
  }
};

export const createProductModerationInAppNotification = async (action, productData, userData, reason = '') => {
  const productId = productData?.id;
  const productName = productData?.name || 'Producto';
  const receiverId = userData?.id;

  if (!receiverId || !productId) return false;

  if (action === 'approved') {
    return createInAppNotification({
      receiverId,
      type: 'product_approved',
      title: 'Producto aprobado',
      message: `Tu producto "${productName}" ya está disponible.`,
      linkUrl: `/product/${productId}`,
      metadata: { product_id: productId }
    });
  }

  if (action === 'rejected') {
    return createInAppNotification({
      receiverId,
      type: 'product_rejected',
      title: 'Producto rechazado',
      message: reason ? `Motivo: ${reason}` : `Tu producto "${productName}" fue rechazado.`,
      linkUrl: `/my-products`,
      metadata: { product_id: productId }
    });
  }

  return false;
};

/**
 * Construye los parámetros del template según el tipo de acción
 * @param {string} action - 'approved' o 'rejected'
 * @param {Object} productData - Datos del producto
 * @param {Object} userData - Datos del usuario
 * @param {string} reason - Razón del rechazo
 * @returns {Object} - Parámetros para el template
 */
const buildTemplateParams = (action, productData, userData, reason) => {
  const baseParams = {
    to_email: userData.email,
    to_name: userData.nombre || 'Usuario',
    product_name: productData.name || 'Producto',
    product_id: productData.id || 'N/A',
    from_name: 'Resmoke',
    reply_to: 'noreply@resmoke.com'
  };

  if (action === 'approved') {
    return {
      ...baseParams,
      notification_title: '¡Producto Aprobado!',
      status_emoji: '✅',
      status_text: 'APROBADO',
      status_color: '#10b981',
      main_message: `¡Excelentes noticias! Tu producto "${productData.name}" ha sido aprobado y ya está disponible en nuestra plataforma.`,
      status_description: 'Tu producto ha sido revisado y cumple con todos nuestros estándares de calidad.',
      approval_date: new Date().toLocaleDateString('es-ES'),
      action_url: `${window.location.origin}/producto/${productData.id}`,
      action_text: 'Ver mi producto',
      closing_message: 'Tu producto ya está visible para todos los usuarios. ¡Esperamos que tengas muchas ventas!',
      additional_message: 'Ahora los compradores pueden encontrar y comprar tu producto.'
    };
  } else if (action === 'rejected') {
    return {
      ...baseParams,
      notification_title: 'Producto Rechazado',
      status_emoji: '❌',
      status_text: 'RECHAZADO',
      status_color: '#ef4444',
      main_message: `Lamentamos informarte que tu producto "${productData.name}" no ha sido aprobado para publicación.`,
      status_description: 'Tu producto no cumple con algunos de nuestros requisitos de publicación.',
      rejection_reason: reason || 'El producto no cumple con nuestras políticas de publicación.',
      approval_date: new Date().toLocaleDateString('es-ES'),
      action_url: `${window.location.origin}/mis-productos`,
      action_text: 'Ver mis productos',
      closing_message: 'Puedes revisar nuestras políticas y volver a intentarlo con las correcciones necesarias.',
      additional_message: 'Te recomendamos revisar las políticas de publicación antes de volver a subir el producto.'
    };
  }

  return baseParams;
};

/**
 * Envía un email de notificación cuando un producto es aprobado
 * @param {Object} productData - Datos del producto
 * @param {Object} userData - Datos del usuario
 * @returns {Promise<boolean>} - True si el email se envió correctamente
 */
export const sendProductApprovedEmail = async (productData, userData) => {
  return await sendProductNotification('approved', productData, userData);
};

/**
 * Envía un email de notificación cuando un producto es rechazado
 * @param {Object} productData - Datos del producto
 * @param {Object} userData - Datos del usuario
 * @param {string} reason - Razón del rechazo (opcional)
 * @returns {Promise<boolean>} - True si el email se envió correctamente
 */
export const sendProductRejectedEmail = async (productData, userData, reason = '') => {
  return await sendProductNotification('rejected', productData, userData, reason);
};

/**
 * Envía un email de recuperación de contraseña
 * @param {string} userEmail - Email del usuario
 * @param {string} userName - Nombre del usuario
 * @param {string} resetLink - Link para resetear la contraseña
 * @returns {Promise<boolean>} - True si el email se envió correctamente
 */
export const sendPasswordResetEmail = async (userEmail, userName, resetLink) => {
  try {
    if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) return false;
    // Inicializar EmailJS
    emailjs.init(EMAILJS_PUBLIC_KEY);

    const templateParams = {
      to_email: userEmail,
      to_name: userName,
      reset_link: resetLink,
      message: `Hola ${userName}, hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el enlace para continuar.`,
      from_name: 'Resmoke'
    };

    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID, // Usa el template existente para recuperación de contraseña
      templateParams
    );

    console.log('Email de recuperación enviado exitosamente:', result);
    return true;
  } catch (error) {
    console.error('Error enviando email de recuperación:', error);
    return false;
  }
};
