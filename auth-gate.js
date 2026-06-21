// ============================================================
// SUN SKILLS — Auth Gate
// Redirects to login page if user is not authenticated.
// Add this script AFTER firebase.js on all protected pages.
// DO NOT add on: index.html, registration.html
// ============================================================
(function() {
  // Wait for Firebase to be ready
  if (typeof firebase === 'undefined' || typeof firebase.auth === 'undefined') {
    // Firebase not loaded — redirect to login
    window.location.replace('registration.html');
    return;
  }

  var auth = firebase.auth();
  var unsubscribe = auth.onAuthStateChanged(function(user) {
    unsubscribe(); // Only check once
    if (!user) {
      // Not logged in — redirect to login
      window.location.replace('registration.html');
    }
  });
})();
