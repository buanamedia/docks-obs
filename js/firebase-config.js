// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCcb3yV4wWTF-G1_5weDpBFrdgBIE3JDYs",
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

// Inisialisasi Auth & Database Global
window.auth = firebase.auth();
window.database = firebase.database();
var database = window.database;
