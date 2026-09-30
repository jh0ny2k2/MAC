// Configuración para Google OAuth
// IMPORTANTE: Reemplaza GOOGLE_CLIENT_ID con tu Client ID real de Google Cloud Console

export const GOOGLE_CONFIG = {
  // Obtén tu Client ID desde: https://console.cloud.google.com/apis/credentials
  // Ejemplo: "123456789-abcdefghijklmnop.apps.googleusercontent.com"
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || "878050016101-flcgq1dq2osib8ubtsspgojlvuc55mqs.apps.googleusercontent.com",
  
  // Configuración adicional
  redirectUri: `${window.location.origin}/auth/callback`,
  scope: 'openid email profile',
  
  // Configuración para desarrollo local
  cookiePolicy: 'single_host_origin',
  
  // Configuración de respuesta
  responseType: 'code',
  accessType: 'offline',
  prompt: 'consent'
};

// Función para validar la configuración
export const validateGoogleConfig = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  
  if (!clientId) {
    console.warn('⚠️ VITE_GOOGLE_CLIENT_ID no está configurado. Usando valor por defecto.');
    console.warn('Para configurar tu propio Client ID:');
    console.warn('1. Ve a https://console.cloud.google.com/apis/credentials');
    console.warn('2. Crea un nuevo proyecto o selecciona uno existente');
    console.warn('3. Crea credenciales OAuth 2.0');
    console.warn('4. Agrega tu dominio a los orígenes autorizados');
    console.warn('5. Copia el Client ID y agrégalo a tu archivo .env como VITE_GOOGLE_CLIENT_ID');
  }
  
  return {
    isValid: !!clientId,
    clientId: clientId || GOOGLE_CONFIG.clientId
  };
};

export default GOOGLE_CONFIG;