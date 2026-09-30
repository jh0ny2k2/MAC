<div align="center">

# 🚀 Resmoke - Plataforma de Comercio Electrónico

[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.1.11-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Resend](https://img.shields.io/badge/Resend-Email_API-FF4A4A?style=for-the-badge&logo=resend&logoColor=white)](https://resend.com/)
[![React Email](https://img.shields.io/badge/React_Email-Components-000000?style=for-the-badge)](https://react.email/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Una plataforma moderna de comercio electrónico construida con tecnologías de vanguardia para ofrecer una experiencia de compra y venta excepcional.**

[🌐 Demo en Vivo](https://resmoke.netlify.app) • [📖 Documentación](https://github.com/tu-usuario/resmoke/wiki) • [🐛 Reportar Bug](https://github.com/tu-usuario/resmoke/issues) • [💡 Solicitar Feature](https://github.com/tu-usuario/resmoke/issues)

</div>

---

## 📋 Tabla de Contenidos

- [✨ Características Principales](#-características-principales)
- [🛠️ Stack Tecnológico](#️-stack-tecnológico)
- [🚀 Inicio Rápido](#-inicio-rápido)
- [📦 Instalación Detallada](#-instalación-detallada)
- [🏗️ Arquitectura del Proyecto](#️-arquitectura-del-proyecto)
- [🎯 Funcionalidades](#-funcionalidades)
- [📱 PWA Features](#-pwa-features)
- [🔍 SEO & Performance](#-seo--performance)
- [🚀 Scripts Disponibles](#-scripts-disponibles)
- [🌐 Despliegue](#-despliegue)
- [🤝 Contribución](#-contribución)
- [📄 Licencia](#-licencia)
- [📞 Contacto](#-contacto)

---

## ✨ Características Principales

<table>
<tr>
<td width="50%">

### 🛍️ **Marketplace Completo**
- Catálogo de productos dinámico
- Sistema de búsqueda avanzada
- Filtros por categoría, precio y ubicación
- Carrito de compras inteligente

### 👤 **Gestión de Usuarios**
- Autenticación segura con Supabase
- Login con Google OAuth
- Perfiles personalizables
- Sistema de reputación

</td>
<td width="50%">

### 💬 **Comunicación en Tiempo Real**
- Chat integrado entre usuarios
- Notificaciones push
- Sistema de contraoferta
- Historial de conversaciones
- Emails transaccionales automáticos (contraofertas y mensajes)

### 📊 **Analytics & Monetización**
- Google Analytics 4 integrado
- Google AdSense implementado
- Dashboard de estadísticas
- Métricas de rendimiento

</td>
</tr>
</table>

### 🌟 **Características Adicionales**

- 📱 **Diseño Responsive** - Optimizado para todos los dispositivos
- ⭐ **Sistema de Favoritos** - Guarda productos de interés
- 🔍 **SEO Optimizado** - Meta tags dinámicos y structured data
- 🚀 **PWA Ready** - Instalable como aplicación nativa
- 📧 **Notificaciones Email** - Recordatorios y actualizaciones automáticas
- 🗺️ **Mapas Interactivos** - Integración con Leaflet para ubicaciones
- 📈 **Gráficos y Estadísticas** - Visualización de datos con Chart.js

---

## 🛠️ Stack Tecnológico

### **Frontend**
- **React 19.1.0** - Biblioteca de UI con las últimas características
- **Vite 7.0.4** - Build tool ultrarrápido
- **React Router DOM 7.7.1** - Navegación SPA
- **TailwindCSS 4.1.11** - Framework CSS utility-first

### **Backend & Database**
- **Supabase** - Backend-as-a-Service con PostgreSQL
- **Supabase Auth** - Autenticación y autorización
- **Real-time subscriptions** - Actualizaciones en tiempo real

### **Integrations & Analytics**
- **Google Analytics 4** - Análisis de comportamiento
- **Google AdSense** - Monetización
- **Google OAuth** - Autenticación social
- **Resend + React Email** - Emails transaccionales y plantillas
- **Leaflet** - Mapas interactivos

### **Development & Quality**
- **ESLint** - Linting de código
- **React Helmet Async** - Gestión de meta tags
- **Chart.js** - Visualización de datos

---

## 🚀 Inicio Rápido

```bash
# Clona el repositorio
git clone https://github.com/tu-usuario/resmoke.git
cd resmoke

# Instala dependencias
npm install

# Configura variables de entorno
cp .env.example .env
# Edita .env con tus credenciales

# Inicia el servidor de desarrollo (backend + frontend)
npm run dev:full
```

🎉 **¡Listo!** Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

---

## 📦 Instalación Detallada

### **Prerrequisitos**

- Node.js 18+ 
- npm 9+ o yarn 1.22+
- Cuenta de Supabase
- Cuenta de Google (para Analytics y OAuth)

### **1. Configuración del Proyecto**

```bash
# Clona el repositorio
git clone https://github.com/tu-usuario/resmoke.git
cd resmoke

# Instala dependencias
npm install
```

### **2. Configuración de Variables de Entorno**

Crea un archivo `.env` en la raíz del proyecto:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key

# Google Services
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_GOOGLE_CLIENT_ID=tu_google_client_id.apps.googleusercontent.com

# Email (Resend)
RESEND_API_KEY=tu_resend_api_key
EMAIL_FROM="Resmoke <no-reply@resmoke.es>"

# Google AdSense
VITE_GOOGLE_ADSENSE_CLIENT=ca-pub-xxxxxxxxxx
```

### **3. Configuración de Supabase**

1. Crea un nuevo proyecto en [Supabase](https://supabase.com)
2. Ejecuta las migraciones SQL incluidas:
   ```bash
   # En el SQL Editor de Supabase, ejecuta:
   # - fix_supabase_policies.sql
   # - fix_images_display.sql
   ```
3. Configura las políticas RLS según tu necesidad

### **4. Configuración de Google Services**

#### Google Analytics:
1. Crea una propiedad GA4 en [Google Analytics](https://analytics.google.com)
2. Obtén tu `MEASUREMENT_ID`

#### Google OAuth:
1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea credenciales OAuth 2.0
3. Configura los dominios autorizados

#### Google AdSense:
1. Solicita una cuenta en [Google AdSense](https://www.google.com/adsense)
2. Obtén tu código de cliente

### **5. Iniciar el Proyecto**

```bash
# Desarrollo
npm run dev:full

# Producción
npm run build && npm run preview
```

---

## 🏗️ Arquitectura del Proyecto

```
resmoke/
├── 📁 public/                    # Archivos estáticos
│   ├── 📁 img/resmoke/          # Imágenes del proyecto
│   ├── 📄 _headers              # Netlify headers
│   ├── 📄 ads.txt               # AdSense anuncios
│   ├── 📄 manifest.json         # PWA manifest
│   ├── 📄 robots.txt            # SEO robots
│   ├── 📄 sitemap.xml           # Sitemap
│   └── 📄 google*.html          # Verificación Google
├── 📁 src/
│   ├── 📁 assets/
│   │   └── 📄 react.svg
│   ├── 📁 components/           # Componentes reutilizables
│   │   ├── 📁 Ads/
│   │   ├── 📁 Cookies/
│   │   ├── 📁 Layout/
│   │   ├── 📁 LazyImage/
│   │   ├── 📁 Modals/
│   │   ├── 📁 NotificationBell/
│   │   ├── 📁 RouteGuards/
│   │   ├── 📁 SEO/
│   │   ├── 📁 Subscription/
│   │   └── 📁 UI/
│   ├── 📁 config/
│   │   ├── 📄 googleAdsense.js
│   │   └── 📄 googleAuth.js
│   ├── 📁 contexts/
│   │   └── 📄 AuthContext.jsx
│   ├── 📁 emails/               # Plantillas de email (React Email)
│   │   ├── � CounterOfferAccepted.js
│   │   ├── 📄 CounterOfferReceived.js
│   │   ├── � ProductAdded.js
│   │   └── 📄 UnreadMessageNotification.js
│   ├── 📁 hooks/
│   │   ├── 📄 useAds.js
│   │   ├── 📄 useAnalytics.js
│   │   └── � useSubscription.js
│   ├── 📁 lib/
│   │   ├── 📄 analytics.js
│   │   ├── 📄 googleAnalytics.js
│   │   ├── 📄 googleAnalyticsReporting.js
│   │   └── 📄 supabase.js
│   ├── 📁 pages/                # Páginas de la aplicación
│   │   ├── 📁 About/
│   │   ├── 📁 AddProduct/
│   │   ├── 📁 Admin/
│   │   ├── 📁 Auth/
│   │   ├── 📁 Category/
│   │   ├── 📁 Chat/
│   │   ├── 📁 Checkout/
│   │   ├── 📁 Favorites/
│   │   ├── 📁 Home/
│   │   ├── 📁 Legal/
│   │   ├── 📁 Product/
│   │   ├── 📁 Profile/
│   │   ├── 📁 Purchases/
│   │   ├── 📁 Statistics/
│   │   └── 📁 Subscription/
│   ├── 📁 services/
│   │   ├── 📄 netlifyAdminService.js
│   │   ├── � stripeAdminService.js
│   │   ├── 📄 stripeService.js
│   │   ├── 📄 subscriptionService.js
│   │   └── 📄 supabaseAdminService.js
│   ├── 📁 utils/
│   │   ├── 📄 emailNotifications.js
│   │   ├── 📄 sitemap.js
│   │   └── � structuredData.js
│   ├── 📄 App.css
│   ├── 📄 App.jsx
│   ├── 📄 index.css
│   └── 📄 main.jsx
├── � netlify/
│   └── 📁 functions/
│       ├── 📄 create-checkout-session.js
│       ├── 📄 email-send.js
│       ├── 📄 env-check.js
│       ├── 📄 process-subscription.js
│       ├── 📄 stripe-admin-data.js
│       ├── � stripe-webhook.js
│       └── 📄 test-webhook.js
├── 📄 .env
├── 📄 .env.example
├── 📄 netlify.toml
├── 📄 server.js                 # Backend local (desarrollo)
├── 📄 index.html
├── 📄 package.json
├── 📄 package-lock.json
├── 📄 eslint.config.js
├── 📄 vite.config.js
└── 📄 README.md
```

---

## 🎯 Funcionalidades

### 🛒 **E-commerce Core**

<details>
<summary><strong>Gestión de Productos</strong></summary>

- ✅ CRUD completo de productos
- ✅ Subida múltiple de imágenes
- ✅ Categorización automática
- ✅ Sistema de precios dinámico
- ✅ Gestión de inventario
- ✅ Productos destacados

</details>

<details>
<summary><strong>Sistema de Búsqueda</strong></summary>

- ✅ Búsqueda en tiempo real
- ✅ Filtros avanzados (precio, ubicación, categoría)
- ✅ Ordenamiento múltiple
- ✅ Sugerencias automáticas
- ✅ Historial de búsquedas

</details>

<details>
<summary><strong>Carrito y Checkout</strong></summary>

- ✅ Carrito persistente
- ✅ Cálculo automático de totales
- ✅ Proceso de checkout simplificado
- ✅ Múltiples métodos de pago
- ✅ Confirmación por email

</details>

### 👥 **Gestión de Usuarios**

<details>
<summary><strong>Autenticación</strong></summary>

- ✅ Registro/Login tradicional
- ✅ OAuth con Google
- ✅ Recuperación de contraseña
- ✅ Verificación de email
- ✅ Sesiones seguras

</details>

<details>
<summary><strong>Perfiles</strong></summary>

- ✅ Perfiles personalizables
- ✅ Avatar y información personal
- ✅ Historial de actividad
- ✅ Sistema de reputación
- ✅ Configuraciones de privacidad

</details>

### 💬 **Comunicación**

<details>
<summary><strong>Chat en Tiempo Real</strong></summary>

- ✅ Mensajería instantánea
- ✅ Notificaciones push
- ✅ Historial de conversaciones
- ✅ Estados de lectura
- ✅ Archivos adjuntos

</details>

<details>
<summary><strong>Sistema de Ofertas</strong></summary>

- ✅ Ofertas y contraofertas
- ✅ Negociación automática
- ✅ Notificaciones de ofertas
- ✅ Historial de negociaciones

</details>

### 📊 **Analytics & Admin**

<details>
<summary><strong>Dashboard Administrativo</strong></summary>

- ✅ Métricas en tiempo real
- ✅ Gestión de usuarios
- ✅ Moderación de contenido
- ✅ Reportes financieros
- ✅ Configuración del sistema

</details>

<details>
<summary><strong>Estadísticas de Usuario</strong></summary>

- ✅ Visitas a productos
- ✅ Conversiones de venta
- ✅ Análisis de comportamiento
- ✅ Reportes personalizados

</details>

---

## 📱 PWA Features

Resmoke está optimizado como **Progressive Web App**:

### 🚀 **Características PWA**
- ✅ **Instalable** - Se puede instalar como app nativa
- ✅ **Offline Ready** - Funcionalidad básica sin conexión
- ✅ **Push Notifications** - Notificaciones en tiempo real
- ✅ **App-like Experience** - Navegación fluida
- ✅ **Auto-updates** - Actualizaciones automáticas

### 📱 **Soporte Multiplataforma**
- ✅ iOS Safari
- ✅ Android Chrome
- ✅ Desktop (Chrome, Edge, Firefox)
- ✅ Responsive en todos los dispositivos

---

## 🔍 SEO & Performance

### 🎯 **Optimización SEO**

- ✅ **Meta Tags Dinámicos** - Únicos para cada página
- ✅ **Open Graph** - Optimizado para redes sociales
- ✅ **Twitter Cards** - Previsualizaciones enriquecidas
- ✅ **Structured Data** - Schema.org JSON-LD
- ✅ **Sitemap Automático** - Generación dinámica
- ✅ **Robots.txt** - Configuración para crawlers

### ⚡ **Performance**

- ✅ **Lazy Loading** - Carga diferida de imágenes
- ✅ **Code Splitting** - Carga bajo demanda
- ✅ **Optimización de Bundle** - Tamaño mínimo
- ✅ **Caching Estratégico** - Mejores tiempos de carga
- ✅ **CDN Ready** - Preparado para CDN

### 📊 **Métricas**

- 🟢 **Performance Score**: 95+
- 🟢 **Accessibility**: 100
- 🟢 **Best Practices**: 100
- 🟢 **SEO**: 100

---

## 🚀 Scripts Disponibles

```bash
# 🔧 Desarrollo
npm run dev          # Servidor de desarrollo con HMR
npm run server       # Backend local (emails, datos auxiliares)
npm run dev:full     # Lanza backend + Vite en paralelo
npm run dev --host   # Servidor accesible en red local

# 🏗️ Construcción
npm run build        # Build optimizado para producción
npm run preview      # Preview de la build de producción

# 🔍 Calidad de Código
npm run lint         # Ejecuta ESLint
npm run lint:fix     # Corrige errores automáticamente

# 📊 Análisis
npm run analyze      # Analiza el bundle size
npm run lighthouse   # Ejecuta auditoría de Lighthouse
```

---

## 🌐 Despliegue

### **Netlify (Recomendado)**

1. **Conecta tu repositorio** a Netlify
2. **Configura las variables de entorno** en el dashboard
3. **Build settings:**
   ```
   Build command: npm run build
   Publish directory: dist
   ```
4. **Deploy automático** en cada push

Endpoints de email:
- Desarrollo: `http://localhost:3001/api/email/send` (servidor local)
- Producción: `/.netlify/functions/email-send` (Netlify Functions)

### **Vercel**

```bash
# Instala Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### **Manual**

```bash
# Construye el proyecto
npm run build

# Sube la carpeta 'dist' a tu servidor
```

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Sigue estos pasos:

### **🔄 Proceso de Contribución**

1. **Fork** el proyecto
2. **Crea** una rama para tu feature
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit** tus cambios
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push** a la rama
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Abre** un Pull Request

### **📋 Guidelines**

- Sigue las convenciones de código existentes
- Añade tests para nuevas funcionalidades
- Actualiza la documentación si es necesario
- Asegúrate de que todos los tests pasen

### **🐛 Reportar Bugs**

Usa el [issue tracker](https://github.com/tu-usuario/resmoke/issues) para reportar bugs. Incluye:

- Descripción detallada del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots si es aplicable
- Información del entorno

---

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**. Ver el archivo [LICENSE](LICENSE) para más detalles.

```
MIT License

Copyright (c) 2024 Resmoke Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

---

## 📞 Contacto

<div align="center">

### **🚀 Equipo Resmoke**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/tu-usuario)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/tu-perfil)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:contacto@resmoke.com)

**¿Tienes preguntas o sugerencias?**  
No dudes en contactarnos o abrir un issue en GitHub.

---

### **⭐ ¡Si te gusta el proyecto, dale una estrella!**

[![GitHub stars](https://img.shields.io/github/stars/tu-usuario/resmoke?style=social)](https://github.com/tu-usuario/resmoke/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/tu-usuario/resmoke?style=social)](https://github.com/tu-usuario/resmoke/network)

</div>

---

<div align="center">

**Desarrollado con ❤️ usando React + Vite**

*Resmoke - Transformando el comercio electrónico, una línea de código a la vez.*

</div>
> Novedades recientes:
- Contraoferta recibida → email al vendedor
- Contraoferta aceptada → email al comprador
- Mensaje no leído → email al destinatario con enlace directo al chat
- Enrutamiento dinámico de endpoints (dev/prod) y `reply_to` configurado
