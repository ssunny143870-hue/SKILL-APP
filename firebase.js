// ============================================================
// SUN SKILLS — Firebase Configuration
// ============================================================
// INSTRUCTIONS:
// 1. Go to https://console.firebase.google.com
// 2. Create a new project (or use existing one)
// 3. Go to Project Settings > General > Your Apps > Web App
// 4. Register a web app and copy the config values below
// 5. Enable Authentication (Email/Password, Google) in Firebase Console
// 6. Enable Firestore Database in Firebase Console
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyCwDs32P29hE1iiYkDWAOUnHU2DXmGrf8s",
  authDomain: "sun-skills.firebaseapp.com",
  projectId: "sun-skills",
  storageBucket: "sun-skills.firebasestorage.app",
  messagingSenderId: "983686663796",
  appId: "1:983686663796:web:1d62eb0b9c9663bc724b21",
  measurementId: "G-MJJR0CQGKV"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase Services
const auth = firebase.auth();
const db = firebase.firestore();
const analytics = firebase.analytics();

// ============================================================
// AUTHENTICATION HELPERS
// ============================================================

// Sign Up with Email & Password
function signUp(email, password) {
  return auth.createUserWithEmailAndPassword(email, password);
}

// Sign In with Email & Password
function signIn(email, password) {
  return auth.signInWithEmailAndPassword(email, password);
}

// Sign In with Google
function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  return auth.signInWithPopup(provider);
}

// Sign Out
function signOut() {
  return auth.signOut();
}

// Check if user is logged in
function onAuthStateChanged(callback) {
  return auth.onAuthStateChanged(callback);
}

// Get current user
function getCurrentUser() {
  return auth.currentUser;
}

// ============================================================
// FIRESTORE HELPERS
// ============================================================

// Save user profile
function saveUserProfile(uid, data) {
  return db.collection('users').doc(uid).set(data, { merge: true });
}

// Get user profile
function getUserProfile(uid) {
  return db.collection('users').doc(uid).get();
}

// Save user progress (e.g., test scores, completed materials)
function saveProgress(uid, track, data) {
  return db.collection('users').doc(uid).collection('progress').doc(track).set(data, { merge: true });
}

// Get user progress
function getProgress(uid, track) {
  return db.collection('users').doc(uid).collection('progress').doc(track).get();
}

// Save bookmark
function saveBookmark(uid, bookmarkData) {
  return db.collection('users').doc(uid).collection('bookmarks').add(bookmarkData);
}

// Get all bookmarks
function getBookmarks(uid) {
  return db.collection('users').doc(uid).collection('bookmarks').get();
}

// ============================================================
// AUTH STATE LISTENER — Update UI based on login status
// ============================================================
onAuthStateChanged(function(user) {
  // Elements
  var avatarEl = document.querySelector('.avatar');
  var ddName = document.querySelector('#profileDD .dd-head strong, #profileDD .dd-head');
  var authLink = document.getElementById('authLink');
  var authLinkSub = document.getElementById('authLinkSub');
  var loginBtn = document.getElementById('topbarLoginBtn');
  var profileWrap = document.getElementById('profileWrap');
  var sidebarAuthLink = document.getElementById('sidebarAuthLink');

  if (user) {
    console.log('✅ Logged in as:', user.email);
    var initials = (user.displayName || user.email || 'U').substring(0, 2).toUpperCase();

    // Show profile dropdown, hide login button
    if (loginBtn) loginBtn.style.display = 'none';
    if (profileWrap) profileWrap.style.display = '';

    // Update avatar & name
    if (avatarEl) avatarEl.textContent = initials;
    if (ddName) ddName.textContent = user.displayName || user.email;

    // Logout link
    if (authLink) {
      authLink.href = '#';
      authLink.onclick = function(e) {
        e.preventDefault();
        signOut().then(function() { window.location.href = 'registration.html'; });
      };
    }
    if (authLinkSub) authLinkSub.textContent = user.email;

    // Sidebar
    if (sidebarAuthLink) {
      sidebarAuthLink.href = '#';
      sidebarAuthLink.innerHTML = '<i class="fas fa-sign-out-alt"></i> <span>Log Out (' + (user.displayName || user.email).substring(0, 15) + ')</span>';
      sidebarAuthLink.onclick = function(e) {
        e.preventDefault();
        signOut().then(function() { window.location.href = 'registration.html'; });
      };
    }

    // Profile email
    var profileEmail = document.getElementById('profileEmail');
    if (profileEmail) profileEmail.textContent = user.email;
  } else {
    console.log('🔒 Not logged in');

    // Show login button, hide profile dropdown
    if (loginBtn) loginBtn.style.display = '';
    if (profileWrap) profileWrap.style.display = 'none';
  }
});
