// Receive push and show a notification
self.addEventListener('push', (event) => {
  console.log('[Service Worker]: Received push event', event);

  let notificationData = {};

  try {
    notificationData = event.data.json();
  } catch (error) {
    console.error('[Service Worker]: Error parsing notification data', error);
    notificationData = {
      title: 'No data from server',
    };
  }

  console.log('[Service Worker]: notificationData', notificationData);

  const showNotificationPromise = self.registration.showNotification(
    notificationData.title,
    notificationData
  );

  event.waitUntil(showNotificationPromise);
});

// Custom notification actions
self.addEventListener('notificationclick', (event) => {
  console.log(
    '[Service Worker]: Received notificationclick event',
    event.notification
  );

  try {
    let notification = event.notification;

    if (event.action == 'open_url') {
      console.log('[Service Worker]: Performing action open_project_repo');

      event.waitUntil(clients.openWindow(notification.data.action.url));

      return;
    }
  } catch (error) {
    console.error('[Service Worker]: Error parsing notification data', error);
  }

  console.log('[Service Worker]: Performing default click action');

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(
    clients
      .matchAll({
        includeUncontrolled: true,
        type: 'window',
      })
      .then(function (clientList) {
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if (client.url == '/' && 'focus' in client) return client.focus();
        }
        if (clients.openWindow) return clients.openWindow('/');
      })
  );

  event.notification.close();
});

// Closing notification action
self.addEventListener('notificationclose', (event) => {
  console.log(
    '[Service Worker]: Received notificationclose event',
    event.notification
  );
});
