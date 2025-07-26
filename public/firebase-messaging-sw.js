importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");

firebase.initializeApp({
    apiKey: "AIzaSyArTemyasA1kr-PFKaVmz5QPwugTJOVcfA",
    projectId: "inventory-notificaion",
    messagingSenderId: "538270436116",
    appId: "1:538270436116:web:dc710aadc6f851c7579001",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("Background message: ", payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.image,
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});
