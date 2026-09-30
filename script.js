import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

// ===============================
// FIREBASE CONFIG
// ===============================
const firebaseConfig = {
  apiKey: "AIzaSyBlz6jMOYuJzWVd7pLTyAR8lkBJbAHYq40",
  authDomain: "cvbuilder-13804.firebaseapp.com",
  projectId: "cvbuilder-13804",
  storageBucket: "cvbuilder-13804.firebasestorage.app",
  messagingSenderId: "419200286217",
  appId: "1:419200286217:web:97f273a6b15db78f8342d8"
};

// ===============================
// INITIALIZE FIREBASE
// ===============================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// ===============================
// DOM
// ===============================
document.addEventListener("DOMContentLoaded", () => {

  const authModal = document.getElementById("authModal");

  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");

  const signupName = document.getElementById("signupName");
  const signupEmail = document.getElementById("signupEmail");
  const signupPassword = document.getElementById("signupPassword");
  const signupConfirm = document.getElementById("signupConfirm");

  const googleLogin = document.getElementById("googleLogin");
  const facebookLogin = document.getElementById("facebookLogin");

  // ===============================
  // OPEN / CLOSE MODAL
  // ===============================
  function openAuth() {
    if (authModal) {
      authModal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  function closeAuth() {
    if (authModal) {
      authModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  document.querySelectorAll(
    "#loginBtn, #heroLogin, #createAccountBtn, #heroCreate"
  ).forEach(button => {
    if (button) {
      button.addEventListener("click", openAuth);
    }
  });

  const closeBtn = document.querySelector(".auth-close");

  if (closeBtn) {
    closeBtn.addEventListener("click", closeAuth);
  }

  if (authModal) {
    authModal.addEventListener("click", e => {
      if (e.target === authModal) {
        closeAuth();
      }
    });
  }

  // ===============================
  // LOGIN / SIGNUP SWITCH
  // ===============================
  const showSignup = document.getElementById("showSignup");
  const showLogin = document.getElementById("showLogin");

  if (showSignup) {
    showSignup.addEventListener("click", e => {
      e.preventDefault();

      loginForm.style.display = "none";
      signupForm.style.display = "block";
    });
  }

  if (showLogin) {
    showLogin.addEventListener("click", e => {
      e.preventDefault();

      signupForm.style.display = "none";
      loginForm.style.display = "block";
    });
  }

  // ===============================
  // EMAIL LOGIN
  // ===============================
  if (loginForm) {
    loginForm.addEventListener("submit", async e => {
      e.preventDefault();

      const email = loginEmail.value.trim();
      const password = loginPassword.value;

      try {
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        alert("Login successful!");
        closeAuth();

        window.location.href = "dashboard.html";

      } catch (error) {
        console.error(error);

        if (error.code === "auth/invalid-credential") {
          alert("Email ya password incorrect hai.");
        } else if (error.code === "auth/too-many-requests") {
          alert("Too many attempts. Thori der baad try karo.");
        } else {
          alert(error.message);
        }
      }
    });
  }

  // ===============================
  // CREATE ACCOUNT
  // ===============================
  if (signupForm) {
    signupForm.addEventListener("submit", async e => {
      e.preventDefault();

      const name = signupName.value.trim();
      const email = signupEmail.value.trim();
      const password = signupPassword.value;
      const confirmPassword = signupConfirm.value;

      if (password !== confirmPassword) {
        alert("Passwords match nahi karte.");
        return;
      }

      if (password.length < 6) {
        alert("Password kam az kam 6 characters ka hona chahiye.");
        return;
      }

      try {
        const userCredential =
          await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );

        const user = userCredential.user;

        alert(`Account created successfully! Welcome ${name}`);

        closeAuth();

        window.location.href = "dashboard.html";

      } catch (error) {
        console.error(error);

        if (error.code === "auth/email-already-in-use") {
          alert("Ye email pehle se registered hai.");
        } else if (error.code === "auth/invalid-email") {
          alert("Email address valid nahi hai.");
        } else {
          alert(error.message);
        }
      }
    });
  }

  // ===============================
  // GOOGLE LOGIN
  // ===============================
  if (googleLogin) {
    googleLogin.addEventListener("click", async () => {

      try {
        const result = await signInWithPopup(
          auth,
          googleProvider
        );

        const user = result.user;

        alert(`Welcome ${user.displayName || "User"}!`);

        window.location.href = "dashboard.html";

      } catch (error) {
        console.error(error);

        if (error.code === "auth/popup-closed-by-user") {
          alert("Google login cancel kar diya gaya.");
        } else {
          alert(error.message);
        }
      }
    });
  }

  // ===============================
  // FACEBOOK
  // ===============================
  if (facebookLogin) {
    facebookLogin.addEventListener("click", () => {
      alert("Facebook Login abhi setup nahi hua. Isay baad mein enable karenge.");
    });
  }

  // ===============================
  // CATEGORY BUTTONS
  // ===============================
  document.querySelectorAll("[data-category]").forEach(card => {

    card.addEventListener("click", () => {

      const category = card.dataset.category;

      localStorage.setItem(
        "selectedCVCategory",
        category
      );

      alert(`Selected category: ${category}`);

      // Category system next step mein dashboard se connect hoga.
    });

  });

  // ===============================
  // THEME
  // ===============================
  const themeToggle = document.getElementById("themeToggle");

  if (themeToggle) {

    const savedTheme =
      localStorage.getItem("cvbuilder-theme");

    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
    }

    themeToggle.addEventListener("click", () => {

      document.body.classList.toggle("dark-mode");

      localStorage.setItem(
        "cvbuilder-theme",
        document.body.classList.contains("dark-mode")
          ? "dark"
          : "light"
      );

    });
  }

  // ===============================
  // AUTH STATE
  // ===============================
  onAuthStateChanged(auth, user => {

    if (user) {
      console.log("Logged in:", user.email);
    } else {
      console.log("No user logged in.");
    }

  });

});
