import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'

self.skipWaiting()
clientsClaim()

cleanupOutdatedCaches()

precacheAndRoute(self.__WB_MANIFEST)

// Push Notifications Listener
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {}
  const title = data.title || 'Resmoke'
  const options = {
    body: data.body || 'Nueva notificación',
    icon: '/img/resmoke/logo.png',
    badge: '/img/resmoke/logo.png',
    data: data.url || '/'
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

// Notification Click Listener
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        let client = clientList[0]
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i]
          }
        }
        return client.focus()
      }
      return clients.openWindow(event.notification.data)
    })
  )
})
