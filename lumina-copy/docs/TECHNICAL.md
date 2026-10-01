# Documentación Técnica — Keptra

> Aplicación web (PWA) para coleccionar y compartir fotos de eventos (bodas, fiestas, momentos especiales) de forma privada. Ex–"Lumina", renombrada a **Keptra** (ago 2026).

---

## 1. Resumen

**Keptra** es una SPA de React construida con Vite. Permite:

- Crear **memorias/álbumes** privados con fotos y vídeos.
- Compartirlas mediante **enlace público + token** (los invitados suben fotos sin crear cuenta).
- Generar **códigos QR** para imprimir en eventos y escanear para subir fotos.
- Comentar, reaccionar y marcar favoritos en álbumes compartidos.
- Monetización vía **Lemon Squeezy** (planes Basic/Pro/Unlimited) con upgrade automático del perfil.
- Soporte **EN/ES** con selector de idioma persistido.
- Instalable como PWA y preparada (deps instaladas) para Capacitor/Android.

El backend es **Supabase** (PostgreSQL + Auth + Storage + Edge Functions).

---

## 2. Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 6 |
| Estilos | Tailwind CSS v4, shadcn/ui, tailwind-merge, framer-motion |
| Enrutado | react-router-dom v7 |
| Datos | @tanstack/react-query, Zustand (estado global) |
| Backend | Supabase (@supabase/supabase-js) |
| Formularios | react-hook-form + zod |
| Pagos | Lemon Squeezy (checkout externo + webhook) |
| Extras | browser-image-compression, jszip, file-saver, react-qr-code, react-helmet-async, vite-plugin-pwa, lucide-react, Capacitor (deps instaladas) |

---

## 3. Estructura del proyecto

```
├── src/
│   ├── main.tsx                  # Bootstrap: StrictMode + HelmetProvider
│   ├── App.tsx                   # Rutas, QueryClient, auth init, lazy-loading
│   ├── index.css                 # Estilos globales / tema
│   ├── lib/
│   │   └── supabase.ts           # Cliente Supabase + tipo Profile
│   ├── store/
│   │   ├── auth.ts               # Sesión + perfil (Zustand)
│   │   └── language.ts           # Idioma EN/ES persistido (Zustand)
│   ├── i18n/
│   │   └── translations.ts       # Diccionario EN/ES tipado
│   ├── components/
│   │   ├── Layout.tsx            # Layout del área privada (/app)
│   │   ├── ProtectedRoute.tsx    # Guard de rutas privadas
│   │   ├── MobileTabBar.tsx      # Navegación inferior tipo app
│   │   ├── SEO.tsx               # Metadatos SEO/OG/Twitter + JSON-LD
│   │   ├── LanguageSwitcher.tsx  # Selector EN/ES
│   │   ├── FilterBar.tsx         # Filtros de Dashboard
│   │   ├── MemoryCard.tsx / MemoryGrid.tsx
│   │   └── Empty.tsx / EmptyState.tsx
│   ├── hooks/
│   │   └── useTheme.ts
│   ├── pages/
│   │   ├── Home.tsx              # Landing principal
│   │   ├── Pricing.tsx           # Planes + checkout Lemon Squeezy
│   │   ├── Support.tsx
│   │   ├── Dashboard.tsx         # Listado de álbumes del usuario
│   │   ├── CreateMemory.tsx      # Alta de álbum (notas/media)
│   │   ├── MemoryDetail.tsx      # Vista álbum privado (QR/share/imprimir)
│   │   ├── PublicMemory.tsx      # Vista pública por token (invitados)
│   │   ├── landing/
│   │   │   ├── Weddings.tsx      # Landing especializada para bodas
│   │   │   └── Demo.tsx          # Demo con datos mock
│   │   └── auth/
│   │       ├── Login.tsx / Signup.tsx / ForgotPassword.tsx / ResetPassword.tsx
│   ├── utils/ (cn.ts, visuals.ts)
│   └── vite-env.d.ts
├── supabase/
│   ├── migrations/               # SQL versionado (schema, RLS, funciones, storage)
│   └── functions/
│       └── lemon-squeezy-webhook/index.ts # Webhook de pagos
├── public/                       # favicon.svg, logo.png, LogoNegro.png, logoBlanco.png, _redirects, robots.txt, sitemap.xml
├── vite.config.ts                # Plugins + PWA manifest
└── components.json               # Config shadcn
```

---

## 4. Comandos disponibles

```bash
npm run dev        # Dev server (Vite, puerto 5174)
npm run build      # tsc -b && vite build
npm run check      # tsc -b --noEmit (typecheck)
npm run lint       # eslint .
npm run preview    # Previsualizar build
```

---

## 5. Configuración de entorno

`.env` en la raíz:

```env
VITE_SUPABASE_URL=https://maoxewgqbagqglqckluw.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

Si faltan variables, `src/lib/supabase.ts` lanza un error al arrancar.

**Secrets de Edge Functions** (Supabase CLI):

```bash
npx supabase login
npx supabase secrets set LEMON_SQUEEZY_WEBHOOK_SECRET=...
```

---

## 6. Rutas

| Ruta | Página | Acceso |
|---|---|---|
| `/` | Home (landing) | Público |
| `/weddings` | Landing bodas | Público |
| `/pricing` | Planes | Público |
| `/demo` | Demo mock | Público |
| `/login`, `/signup`, `/forgot-password`, `/reset-password` | Auth | Público |
| `/support` | Soporte | Público |
| `/share/:token` | Álbum público (invitados) | Público |
| `/app` | Dashboard | Privado |
| `/app/memories/:id` | Detalle de álbum | Privado |
| `/app/memories/new` | Crear álbum | Privado |
| `*` | Redirige a `/` | — |

- Las páginas usan **lazy-loading** con `<Suspense>` y un `PageLoader` (spinner).
- Las rutas privadas están envueltas en `ProtectedRoute`; el área `/app` usa `Layout` (con `MobileTabBar`).

---

## 7. Arquitectura de datos (PostgreSQL)

Tablas principales (`supabase/migrations/`):

| Tabla | Descripción |
|---|---|
| `profiles` | Extiende `auth.users`. `id` = uid de auth. Incluye `plan_tier` (ver nota) |
| `memories` | Álbumes/recuerdos. `status` (`private`/`public_link`/`circle`) + `visibility` (migración posterior), `location`, `cover_media_id`, `share_token` (VARCHAR(32) UNIQUE) |
| `memory_media` | Ficheros de cada memoria (`image`/`video`), `file_url`, `storage_path`, `section_id` |
| `memory_sections` | Subcarpetas dentro de una memoria; `cover_media_id` |
| `circles` / `circle_members` / `circle_invitations` | Círculos de usuarios (compartido interno, sin login previo requerido para ver) |
| `comments` | Comentarios en memorias de círculo |
| `reactions` | Reacciones emoji (`PRIMARY KEY (memory_id, user_id, emoji)`) |
| `favorites` | Favoritos por usuario |
| `tags` / `memory_tags` | Etiquetas |
| `public_share_tokens` | Tokens de compartición pública (invitados sin cuenta) |

Notas:

- Existen **dos schemas iniciales** heredados (`20240225000000` y `20240523000000`) con definiciones solapadas. Conviene no duplicar más y usar los ficheros más recientes.
- **`plan_tier` NO está en las migraciones**: fue añadido manualmente en el SQL Editor de Supabase (columna `TEXT` en `profiles`, valores `free`/`basic`/`pro`/`unlimited`). La app y el webhook lo leen/escriben.

### Índices relevantes

`idx_memories_user_id`, `idx_memories_created_at`, `idx_memories_status`, `idx_memories_circle_id`, `idx_circle_members_user_id`, `idx_comments_memory_id`, `idx_reactions_memory_id`, `idx_favorites_user_id`, `idx_public_share_tokens_token`, `idx_memory_tags_tag_id`.

---

## 8. Seguridad (RLS)

RLS activo en todas las tablas. Políticas clave:

- **profiles**: lectura pública; solo el dueño puede actualizar.
- **memories**: CRUD solo para el propietario (`auth.uid() = user_id`); los miembros de un círculo pueden ver memorias con `status = 'circle'` (vía `is_circle_member()`).
- **circles / circle_members**: solo miembros; insertar miembros solo el owner.
- **comments / reactions**: ver si eres miembro del círculo o dueño; insertar solo miembros.
- **favorites**: solo el propio usuario.
- **public_share_tokens**: lectura pública (para servir álbumes por token).
- **Storage**: bucket `memories` con políticas de subida (propietario) y lectura pública.

---

## 9. Storage

- Bucket **`memories`** (público), tamaño máx. ~50 MB por fichero.
- MIME permitidos: `image/jpeg`, `image/png`, `image/gif`, `image/webp` (+ `video/mp4`, `video/quicktime` en la definición inicial).
- Las rutas se guardan en `memory_media.storage_path` y la URL pública en `file_url`.

---

## 10. Compartición pública por token

Flujo para invitados sin cuenta:

1. El dueño pulsa **Compartir** en `MemoryDetail.tsx` → `supabase.rpc('generate_share_token', { p_memory_id })`.
2. `generate_share_token` valida la propiedad, reutiliza un token activo si existe o crea uno nuevo (`encode(gen_random_bytes(16), 'hex')`) en `public_share_tokens`.
3. URL final: `https://luminamemories.netlify.app/share/<token>` (funcional, aún con el dominio de despliegue antiguo).
4. `PublicMemory.tsx` consulta funciones seguras por token (`get_memory_by_token`, `get_memory_media_by_token`, `add_media_via_token`, `upload_public_media`) para ver el álbum, comentar y subir fotos **sin autenticación**.

> **Importante:** los tokens **ya no expiran** (migración `20260805000000_never_expire_share_tokens.sql`). Ese fichero **está creado pero NO aplicado** en Supabase; debe ejecutarse en el SQL Editor para que los enlaces antiguos (que expiraban a 30 días) dejen de dar "Memory Not Found".

---

## 11. Autenticación

- `store/auth.ts` (Zustand): `initialize()` obtiene la sesión inicial, carga el perfil de `profiles` y suscribe `onAuthStateChange` (evitando bucles si el token no cambió).
- Signup/Login con email+password y **login con Google** (provider a activar en Supabase si aún no está).
- `ProtectedRoute` redirige a `/login` si no hay sesión.
- `ResetPassword.tsx` usa `supabase.auth.updateUser`.

---

## 12. i18n

- Diccionario tipado en `src/i18n/translations.ts` (`translations[en|es][key]`).
- Store `language.ts` (Zustand + `persist`, clave `language-storage`), por defecto **inglés**.
- `LanguageSwitcher` en navbar de las landings.

---

## 13. Monetización y planes

- **Planes**: `free`, `basic` ($19.99), `pro` ($50.99), `unlimited` ($99.99) — precios en céntimos usados por el webhook.
- `Pricing.tsx` enlaza a checkout de **Lemon Squeezy** (URLs con `luminamemories.lemonsqueezy.com`, funcionales).
- **Webhook** `lemon-squeezy-webhook`:
  - Escucha `order_created`.
  - Detecta el plan por el `total` en céntimos.
  - Localiza el usuario por email (profiles o `auth.admin.listUsers`).
  - Actualiza `profiles.plan_tier` con la **service role key**.
- `Dashboard.tsx` / `MemoryDetail.tsx` leen `plan_tier` para mostrar el plan actual.

---

## 14. Edge Functions

### `lemon-squeezy-webhook`
Webhook de pagos (ver §13). Requiere secret `LEMON_SQUEEZY_WEBHOOK_SECRET` (aunque el código actual **no firma/verifica el payload** — pendiente de endurecer).

Despliegue:

```bash
npx supabase functions deploy send-email --no-verify-jwt
npx supabase functions deploy lemon-squeezy-webhook --no-verify-jwt
```

---

## 15. PWA y móvil

- `vite-plugin-pwa` genera el service worker con `autoUpdate`; manifest: **name/short_name "Keptra"**, tema blanco, iconos `favicon.svg` (192/512).
- Estilo **mobile-first**: `MobileTabBar`, botones de acción tipo app, vistas de detalle optimizadas para táctil.
- Deps de **Capacitor** instaladas (`@capacitor/core`, `android`, `cli`) pero **sin `capacitor.config.ts`** ni proyecto Android generado (trabajo futuro para empaquetar la APK).

---

## 16. Despliegue

- **Netlify** (SPA): build `npm run build`, publish `dist`. `public/_redirects` hace `/* → /index.html 200` para el routing del cliente.
- `robots.txt` desindexa `/app/` y `/share/`; `sitemap.xml` referencia el dominio actual `luminamemories.netlify.app` (aún no renombrado).
- Verificación Google Search Console: fichero `google9b1174522b2f0a77.html` en la raíz.

---

## 17. Pendientes / notas

- [ ] Aplicar `20260805000000_never_expire_share_tokens.sql` en Supabase (SQL Editor) para arreglar "Memory Not Found".
- [ ] Activar el **provider de Google** en Supabase → Authentication → Providers (si no está activo).
- [ ] **Renombrar dominio/URLs** de `luminamemories.netlify.app` → `keptramemories.netlify.app` (share links, correos, OG, sitemap) cuando se re-despliegue.
- [ ] Configurar **Capacitor** (`npx cap init` + `npx cap add android`) para la APK; mejorar nativo con plugins.
- [ ] **Firma del webhook** de Lemon Squeezy (verificar firma con `LEMON_SQUEEZY_WEBHOOK_SECRET`).
- [ ] Mover `plan_tier` a una migración para que el schema esté versionado.
