self.addEventListener('push', function(event) {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: data.icon || '/icon-192x192.png',
            badge: '/badge-72x72.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: '2',
                url: data.url || '/'
            }
        };
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

self.addEventListener('notificationclick', function(event) {
    console.log('Notification click received.');
    event.notification.close();
    
    // Open the URL
    event.waitUntil(
        clients.matchAll({type: 'window', includeUncontrolled: true}).then(function(clientList) {
            const url = event.notification.data.url;
            
            // If tab is already open, focus it
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            // Otherwise open a new tab
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});
