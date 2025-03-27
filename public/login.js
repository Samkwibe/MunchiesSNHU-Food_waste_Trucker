import {
    auth,
    signInWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
    GoogleAuthProvider,
    FacebookAuthProvider,
    OAuthProvider,
    signInWithPopup
  } from './firebase.js';
  
  /****** Password Strength Checker ******/
  document.getElementById('passwordInput').addEventListener('input', () => {
    const pass = document.getElementById('passwordInput').value;
    const strengthBar = document.getElementById('strengthBar');
    const strengthLabel = document.getElementById('strengthLabel');
  
    let score = 0;
    if (pass.length >= 8) score += 20;
    if (/[a-z]/.test(pass)) score += 20;
    if (/[A-Z]/.test(pass)) score += 20;
    if (/\d/.test(pass)) score += 20;
    if (/[^A-Za-z0-9]/.test(pass)) score += 20;
  
    strengthBar.style.width = `${score}%`;
  
    let rating = "Very Weak";
    let color = "#ff4e4e";
  
    if (score < 40) {
      rating = "Weak";
      color = "#ff4e4e";
    } else if (score < 80) {
      rating = "Medium";
      color = "#f3d014";
    } else {
      rating = "Strong";
      color = "#4caf50";
    }
  
    strengthLabel.textContent = `Strength: ${rating}`;
    strengthBar.style.backgroundColor = color;
  });
  
  /****** Login with Email/Password ******/
  document.getElementById('loginBtn').addEventListener('click', async () => {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    const remember = document.getElementById('rememberMe').checked;
  
    try {
      const persistenceType = remember ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(auth, persistenceType);
  
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful! Redirecting to dashboard...");
      window.location.href = "dashboard.html";
    } catch (error) {
      alert("Login failed: " + error.message);
      console.error(error);
    }
  });
  
  /****** Social Logins ******/
  // 1) Google
  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      alert("Google sign-in successful. Redirecting...");
      window.location.href = "dashboard.html";
    } catch (error) {
      alert("Google login error: " + error.message);
      console.error(error);
    }
  }
  
  // 2) Facebook
  async function signInWithFacebook() {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      alert("Facebook sign-in successful. Redirecting...");
      window.location.href = "dashboard.html";
    } catch (error) {
      alert("Facebook login error: " + error.message);
      console.error(error);
    }
  }
  
  // 3) Apple
  async function signInWithApple() {
    const provider = new OAuthProvider('apple.com');
    try {
      const result = await signInWithPopup(auth, provider);
      alert("Apple sign-in successful. Redirecting...");
      window.location.href = "dashboard.html";
    } catch (error) {
      alert("Apple login error: " + error.message);
      console.error(error);
    }
  }
  
  // 4) Spotify - custom OAuth
  async function signInWithSpotify() {
    alert("Spotify login is not officially supported by Firebase. Implement a custom OAuth flow here.");
  }
  
  /****** Hook Up Social Button Clicks ******/
  document.getElementById('googleBtn').addEventListener('click', signInWithGoogle);
  document.getElementById('facebookBtn').addEventListener('click', signInWithFacebook);
  document.getElementById('appleBtn').addEventListener('click', signInWithApple);
  document.getElementById('spotifyBtn').addEventListener('click', signInWithSpotify);
  