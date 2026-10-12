// js/auth-check.js

let currentUser = null;
let currentUserRole = 'guest';

// Ambil instans auth & database dari window/global
const auth = window.auth || firebase.auth();
const database = window.database || firebase.database();

// Set sesi login agar bertahan meskipun browser ditutup
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch((err) => {
  console.warn("Gagal set persistence:", err);
});

// Pantau Sesi Login Terpusat
auth.onAuthStateChanged((user) => {
  currentUser = user;
  const loginModal = document.getElementById('loginModal');
  const isLoginPage = window.location.pathname.endsWith('login.html') || window.location.pathname.endsWith('/');

  if (user && !user.isAnonymous) {
    // Sembunyikan Modal Login jika ada
    if (loginModal) loginModal.classList.add('hidden');
    
    // Ambil Role User dari Realtime Database
    database.ref('users/' + user.uid).once('value').then((snapshot) => {
      const userData = snapshot.val();
      
      // Jika data role belum ada, tetapkan role default
      if (!userData || !userData.role) {
        currentUserRole = 'operator';
        database.ref('users/' + user.uid).update({
          email: user.email,
          role: 'operator',
          lastLogin: Date.now()
        });
      } else {
        currentUserRole = userData.role;
      }
      
      // Tampilkan Tombol Kelola User jika Role adalah Admin
      const adminNavBtn = document.getElementById('adminNavBtn');
      if (adminNavBtn) {
        if (currentUserRole === 'admin') {
          adminNavBtn.classList.remove('hidden');
        } else {
          adminNavBtn.classList.add('hidden');
        }
      }
    });

    // Jika pengguna sudah login dan berada di login.html, alihkan ke dock.html
    if (isLoginPage && !sessionStorage.getItem('obs_guest_mode')) {
      window.location.href = 'dock.html';
    }

    // Jalankan fungsi muat data utama halaman
    if (typeof onUserLoggedIn === 'function') {
      onUserLoggedIn(user);
    }
  } else {
    // Pengguna Mode Tamu / Belum Login
    currentUserRole = 'guest';

    // Tampilkan modal login jika halaman menggunakan modal
    if (loginModal) loginModal.classList.remove('hidden');
    
    if (typeof onUserGuest === 'function') {
      onUserGuest();
    }
  }
});

// Fungsi Login (Untuk Modal di dalam Halaman)
function handleLogin() {
  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');

  if (!emailInput || !passwordInput) return;

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    alert('Harap isi Email dan Password!');
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      
      // Catat / Update Sesi Login
      database.ref('users/' + user.uid).update({
        email: user.email,
        lastLogin: Date.now()
      });

      sessionStorage.removeItem('obs_guest_mode');
      if (typeof showToast === 'function') showToast('Login Berhasil!');
    })
    .catch((err) => alert('Gagal Login: ' + err.message));
}

// Fungsi Masuk Mode Tamu
function continueAsGuest() {
  sessionStorage.setItem('obs_guest_mode', 'true');
  const loginModal = document.getElementById('loginModal');
  if (loginModal) loginModal.classList.add('hidden');
  if (typeof showToast === 'function') showToast('Masuk Mode Tamu (Uji Coba)');
}

// Fungsi Logout
function handleLogout() {
  if (confirm('Apakah Anda yakin ingin keluar?')) {
    sessionStorage.removeItem('obs_guest_mode');
    auth.signOut().then(() => {
      window.location.href = 'login.html';
    });
  }
}
