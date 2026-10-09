// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC9r6c7zccoOtWaCctVUzebr1AsHlDSnrE",
  authDomain: "obs-docks-control.firebaseapp.com",
  databaseURL: "https://obs-docks-control-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "obs-docks-control",
  storageBucket: "obs-docks-control.firebasestorage.app",
  messagingSenderId: "9188420341",
  appId: "1:9188420341:web:8b2f4c42240fd7b45db3bc",
};

// Inisialisasi Firebase jika belum diinisialisasi
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Autentikasi Anonim Otomatis
firebase.auth().signInAnonymously().catch((error) => {
  console.error("Gagal login anonim ke Firebase:", error.code, error.message);
});

// Global database reference untuk digunakan di dock.html & overlay.html
const database = firebase.database();
