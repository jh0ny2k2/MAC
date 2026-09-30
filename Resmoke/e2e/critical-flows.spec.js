import { expect, test } from '@playwright/test'

const SUPABASE_BASE = 'https://vzvlyexpgcvdtzaekgeb.supabase.co'

const TEST_USER = {
  id: 'e2e-uuid',
  originalId: 1,
  nombre: 'E2E User',
  email: 'e2e@example.com',
  telefono: '600000000',
  rol: 'usuario',
  isVerified: true,
}

const json = async (route, status, body) => {
  await route.fulfill({
    status,
    headers: {
      'access-control-allow-origin': '*',
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}

const okEmpty = async (route, status = 204) => {
  await route.fulfill({
    status,
    headers: { 'access-control-allow-origin': '*' },
    body: '',
  })
}

const setAuthStorage = async (page, user = TEST_USER) => {
  await page.addInitScript((u) => {
    window.localStorage.setItem('user', JSON.stringify(u))
  }, user)
}

test('Compra: checkout por transferencia y navega a Mis Compras', async ({ page }) => {
  await setAuthStorage(page, TEST_USER)

  page.on('dialog', async (dialog) => {
    if (dialog.type() === 'alert') await dialog.accept()
    else await dialog.dismiss()
  })

  const productId = '123'

  await page.route(`${SUPABASE_BASE}/rest/v1/Users*`, async (route) => {
    if (route.request().method() !== 'GET') return route.fallback()
    await json(route, 200, { id: 1, nombre: 'E2E User', email: TEST_USER.email, telefono: TEST_USER.telefono })
  })

  await page.route(`${SUPABASE_BASE}/rest/v1/products*`, async (route) => {
    const method = route.request().method()
    const url = new URL(route.request().url())

    if (method === 'GET' && url.searchParams.get('id') === `eq.${productId}`) {
      await json(route, 200, {
        id: Number(productId),
        name: 'Producto E2E',
        title: 'Producto E2E',
        description: 'Descripción de producto E2E',
        price: 19.99,
        status: 'available',
        user_id: 2,
        main_image: '/img/resmoke/noFoto.png',
        categories: { id: 10, name: 'Cachimbas' },
        Users: { id: 2, nombre: 'Vendedor', email: 'seller@example.com', profile_image: null },
      })
      return
    }

    if (method === 'PATCH') {
      await json(route, 200, {
        id: Number(productId),
        status: 'sold',
      })
      return
    }

    if (method === 'GET') {
      await json(route, 200, [])
      return
    }

    await route.fallback()
  })

  await page.goto(`/checkout/${productId}`)
  await page.getByText('Transferencia', { exact: false }).click()
  await page.getByRole('button', { name: 'Continuar' }).click()

  await page.waitForURL('**/purchases')
  await expect(page.getByRole('heading', { name: 'Mis Compras' })).toBeVisible()
})

test('Reseñas: subir imagen y enviar reseña desde Mis Compras', async ({ page }) => {
  await setAuthStorage(page, TEST_USER)

  page.on('dialog', async (dialog) => {
    if (dialog.type() === 'alert') await dialog.accept()
    else await dialog.dismiss()
  })

  const soldProduct = {
    id: 555,
    title: 'Producto comprado E2E',
    description: 'Comprado y listo para reseñar',
    price: 10,
    sale_price: 10,
    status: 'sold',
    sold_date: new Date().toISOString(),
    main_image: '/img/resmoke/noFoto.png',
    categories: { id: 1, name: 'Accesorios' },
    Users: { id: 2, nombre: 'Vendedor E2E', email: 'seller@example.com', telefono: '600000001' },
  }

  await page.route(`${SUPABASE_BASE}/rest/v1/Users*`, async (route) => {
    if (route.request().method() !== 'GET') return route.fallback()
    await json(route, 200, { id: 1, nombre: 'E2E User', email: TEST_USER.email })
  })

  await page.route(`${SUPABASE_BASE}/rest/v1/products*`, async (route) => {
    if (route.request().method() !== 'GET') return route.fallback()
    await json(route, 200, [soldProduct])
  })

  await page.route(`${SUPABASE_BASE}/rest/v1/reviews*`, async (route) => {
    const method = route.request().method()
    if (method === 'GET') {
      await json(route, 406, { message: 'Results contain 0 rows' })
      return
    }
    if (method === 'POST') {
      await json(route, 201, {})
      return
    }
    await route.fallback()
  })

  await page.route(`${SUPABASE_BASE}/storage/v1/object/product-images/**`, async (route) => {
    if (route.request().method() === 'POST') {
      await json(route, 200, {})
      return
    }
    await route.fallback()
  })

  await page.goto('/purchases')
  await expect(page.getByRole('heading', { name: 'Mis Compras' })).toBeVisible()

  await page.getByRole('button', { name: 'Reseñar' }).first().click()
  await expect(page.getByRole('heading', { name: 'Escribir reseña' })).toBeVisible()

  await page.getByPlaceholder('Comparte tu experiencia con este vendedor...').fill('Todo perfecto, envío rápido.')

  await page.setInputFiles('#review-image-upload', {
    name: 'review.png',
    mimeType: 'image/png',
    buffer: Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/P7k4cQAAAABJRU5ErkJggg==',
      'base64',
    ),
  })

  await page.getByRole('button', { name: 'Enviar reseña' }).click()
  await expect(page.getByText('Reseña realizada')).toBeVisible()
})

test('Chat: enviar mensaje y verlo en la conversación', async ({ page }) => {
  await setAuthStorage(page, TEST_USER)

  const conversationId = '1'
  const currentUserDbId = 1
  const otherUserDbId = 2

  let messages = [
    {
      id: 10,
      conversation_id: conversationId,
      sender_id: otherUserDbId,
      message: 'Hola 👋',
      created_at: new Date(Date.now() - 60_000).toISOString(),
      sender: { id: otherUserDbId, nombre: 'Vendedor E2E' },
    },
  ]

  await page.route(`${SUPABASE_BASE}/rest/v1/Users*`, async (route) => {
    if (route.request().method() !== 'GET') return route.fallback()
    await json(route, 200, { id: currentUserDbId })
  })

  await page.route(`${SUPABASE_BASE}/rest/v1/conversations*`, async (route) => {
    if (route.request().method() !== 'GET') return route.fallback()
    await json(route, 200, {
      id: conversationId,
      buyer_id: currentUserDbId,
      seller_id: otherUserDbId,
      products: { id: 777, name: 'Producto chat', price: 20, status: 'available' },
      buyer: { id: currentUserDbId, nombre: 'E2E User', email: TEST_USER.email },
      seller: { id: otherUserDbId, nombre: 'Vendedor E2E', email: 'seller@example.com' },
    })
  })

  await page.route(`${SUPABASE_BASE}/rest/v1/messages*`, async (route) => {
    const method = route.request().method()
    if (method === 'GET') {
      await json(route, 200, messages)
      return
    }
    if (method === 'POST') {
      const body = JSON.parse(route.request().postData() || '{}')
      messages = [
        ...messages,
        {
          id: messages[messages.length - 1]?.id + 1 || 1,
          conversation_id: conversationId,
          sender_id: currentUserDbId,
          message: body.message,
          created_at: new Date().toISOString(),
          sender: { id: currentUserDbId, nombre: 'E2E User' },
        },
      ]
      await json(route, 201, {})
      return
    }
    if (method === 'PATCH') {
      await okEmpty(route, 204)
      return
    }
    await route.fallback()
  })

  await page.route(`${SUPABASE_BASE}/rest/v1/conversations*`, async (route) => {
    if (route.request().method() === 'PATCH') {
      await okEmpty(route, 204)
      return
    }
    await route.fallback()
  })

  await page.route('**/.netlify/functions/email-send', async (route) => {
    await json(route, 200, { ok: true })
  })
  await page.route('http://localhost:3001/api/email/send', async (route) => {
    await json(route, 200, { ok: true })
  })

  await page.goto(`/chat/${conversationId}`)
  await expect(page.getByText('Hola 👋')).toBeVisible()

  await page.getByPlaceholder('Escribe tu mensaje...').fill('Mensaje de prueba')
  await page.keyboard.press('Enter')

  await expect(page.getByText('Mensaje de prueba')).toBeVisible()
})

