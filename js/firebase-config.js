// Menggunakan Firebase Compat SDK agar mudah dipakai di HTML biasa
const firebaseConfig = {
  apiKey: "AIzaSyC9r6c7zccoOtWaCctVUzebr1AsHlDSnrE",
  authDomain: "obs-docks-control.firebaseapp.com",
  databaseURL: "https://obs-docks-control-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "obs-docks-control",
  storageBucket: "obs-docks-control.firebasestorage.app",
  messagingSenderId: "9188420341",
  appId: "1:9188420341:web:8b2f4c42240fd7b45db3bc"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
