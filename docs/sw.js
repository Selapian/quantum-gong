self.addEventListener('push', (event) => {
  console.log("Push signal caught.");

  let notificationTitle = 'Quantum Gong';
  let notificationBody = '⚛️ The bell is ringing...';

  if (event.data) {
    try {
      const payloadData = event.data.json();
      if (payloadData.title) notificationTitle = payloadData.title;
      if (payloadData.body) notificationBody = payloadData.body;
    } catch (e) {}
  }

  // Define the notification promise
  const notificationPromise = self.registration.showNotification(notificationTitle, {
    body: notificationBody,
    tag: 'gong-alert',
    renotify: true,
    // Note: 'sound' in showNotification is ignored by most modern browsers
    // Audio must be played via the client message listener instead.
  });

  // Define the client messaging promise
  const clientMessagePromise = self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    .then((clientList) => {
      for (const client of clientList) {
        client.postMessage({ command: "play_gong" });
      }
    });

  // Wait for BOTH the notification to show and the message to be sent
  event.waitUntil(Promise.all([notificationPromise, clientMessagePromise]));
});
