// js/auth-check.js

let currentUser = null;
let currentUserRole = 'guest';

// Set sesi login agar bertahan meskipun browser ditutup
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

// Pantau Sesi Login Terpusat
firebase.auth().onAuthStateChanged((user) => {
  currentUser = user;
  const loginModal = document.getElementById('loginModal');

  if (user && !user.isAnonymous) {
    // Sembunyikan Modal Login
    if (loginModal) loginModal.classList.add('hidden');
    
    // Ambil Role User dari Realtime Database
    database.ref('users/' + user.uid).once('value').then((snapshot) => {
      const userData = snapshot.val();
      currentUserRole = userData ? userData.role : 'operator';
      
      // Tampilkan Tombol Admin jika Role adalah Admin
      const adminNavBtn = document.getElementById('adminNavBtn');
      if (adminNavBtn && currentUserRole === 'admin') {
        adminNavBtn.classList.remove('hidden');
      }
    });

    // Jalankan fungsi muat data utama jika ada
    if (typeof onUserLoggedIn === 'function') {
      onUserLoggedIn(user);
    }
  } else {
    // Pengguna Mode Tamu / Belum Login
    currentUserRole = 'guest';
    if (loginModal) loginModal.classList.remove('hidden');
    
    if (typeof onUserGuest === 'function') {
      onUserGuest();
    }
  }
});

// Fungsi Login
function handleLogin() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  if (!email || !password) {
    alert('Harap isi Email dan Password!');
    return;
  }

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      
      // Catat/Update Data User saat Login
      database.ref('users/' + user.uid).update({
        email: user.email,
        lastLogin: Date.now()
      });

      if (typeof showToast === 'function') showToast('Login Berhasil!');
    })
    .catch((err) => alert('Gagal Login: ' + err.message));
}

// Fungsi Masuk Mode Tamu
function continueAsGuest() {
  firebase.auth().signInAnonymously().then(() => {
    if (typeof showToast === 'function') showToast('Masuk sebagai Tamu (Uji Coba)');
  });
}

// Fungsi Logout
function handleLogout() {
  if (confirm('Apakah Anda yakin ingin keluar?')) {
    firebase.auth().signOut().then(() => window.location.reload());
  }
}
