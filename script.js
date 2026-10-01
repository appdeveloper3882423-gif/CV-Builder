/* =========================================================
   CVBUILDER — AUTHENTICATION & LANDING PAGE
========================================================= */

import {
  auth
} from "./firebase-config.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = (id) => document.getElementById(id);


/* =========================================================
   AUTH STATE
========================================================= */

let authMode = "signup";

let redirectAfterLogin = null;


/* =========================================================
   DOM ELEMENTS
========================================================= */

const authModal = $("authModal");
const authForm = $("authForm");

const authTitle = $("authTitle");
const authSubtitle = $("authSubtitle");

const authEmail = $("authEmail");
const authPassword = $("authPassword");

const authSubmitButton = $("authSubmitButton");

const authSwitchText = $("authSwitchText");
const authSwitchButton = $("authSwitchButton");

const googleLoginButton = $("googleLoginButton");

const authMessage = $("authMessage");


/* =========================================================
   AUTH MODAL
========================================================= */

function openAuthModal(mode = "signup", redirect = null) {

  authMode = mode;
  redirectAfterLogin = redirect;

  updateAuthModal();

  authModal.classList.add("active");

  document.body.style.overflow = "hidden";

  setTimeout(() => {

    if (authEmail) {
      authEmail.focus();
    }

  }, 100);
}


function closeAuthModal() {

  authModal.classList.remove("active");

  document.body.style.overflow = "";

  clearAuthMessage();

  if (authForm) {
    authForm.reset();
  }

}


/* =========================================================
   UPDATE AUTH MODAL
========================================================= */

function updateAuthModal() {

  clearAuthMessage();

  if (authMode === "login") {

    authTitle.textContent = "Welcome Back";

    authSubtitle.textContent =
      "Login to access your CVBuilder dashboard.";

    authSubmitButton.textContent = "Login";

    authSwitchText.textContent =
      "Don't have an account?";

    authSwitchButton.textContent =
      "Create Account";

    authPassword.setAttribute(
      "autocomplete",
      "current-password"
    );

  } else {

    authTitle.textContent =
      "Create Your Account";

    authSubtitle.textContent =
      "Start building your professional CV today.";

    authSubmitButton.textContent =
      "Create Account";

    authSwitchText.textContent =
      "Already have an account?";

    authSwitchButton.textContent =
      "Login";

    authPassword.setAttribute(
      "autocomplete",
      "new-password"
    );

  }

}


/* =========================================================
   AUTH MESSAGE
========================================================= */

function showAuthMessage(message, type = "error") {

  if (!authMessage) return;

  authMessage.textContent = message;

  authMessage.className =
    `auth-message show ${type}`;

}


function clearAuthMessage() {

  if (!authMessage) return;

  authMessage.textContent = "";

  authMessage.className =
    "auth-message";

}


/* =========================================================
   BUTTON LOADING
========================================================= */

function setButtonLoading(button, loading, loadingText) {

  if (!button) return;

  if (loading) {

    button.dataset.originalText =
      button.textContent;

    button.disabled = true;

    button.textContent =
      loadingText;

  } else {

    button.disabled = false;

    button.textContent =
      button.dataset.originalText ||
      button.textContent;

  }

}


/* =========================================================
   FIREBASE ERROR MESSAGE
========================================================= */

function getFirebaseErrorMessage(error) {

  const code = error?.code || "";

  switch (code) {

    case "auth/email-already-in-use":
      return "An account already exists with this email address.";

    case "auth/invalid-email":
      return "Please enter a valid email address.";

    case "auth/weak-password":
      return "Password should be at least 6 characters.";

    case "auth/invalid-credential":
      return "Email or password is incorrect.";

    case "auth/user-not-found":
      return "No account was found with this email address.";

    case "auth/wrong-password":
      return "Email or password is incorrect.";

    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled.";

    case "auth/popup-blocked":
      return "The Google login popup was blocked by your browser.";

    case "auth/account-exists-with-different-credential":
      return "An account already exists using another sign-in method.";

    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";

    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";

    case "auth/operation-not-allowed":
      return "This sign-in method is not enabled in Firebase.";

    default:
      console.error("Firebase Error:", error);

      return "Something went wrong. Please try again.";
  }

}


/* =========================================================
   EMAIL AUTHENTICATION
========================================================= */

async function handleEmailAuthentication(event) {

  event.preventDefault();

  clearAuthMessage();

  const email =
    authEmail.value.trim();

  const password =
    authPassword.value;

  if (!email) {

    showAuthMessage(
      "Please enter your email address."
    );

    return;
  }

  if (!password) {

    showAuthMessage(
      "Please enter your password."
    );

    return;
  }

  if (password.length < 6) {

    showAuthMessage(
      "Password should be at least 6 characters."
    );

    return;
  }


  setButtonLoading(
    authSubmitButton,
    true,
    authMode === "login"
      ? "Logging in..."
      : "Creating account..."
  );


  try {

    if (authMode === "signup") {

      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      showAuthMessage(
        "Account created successfully. Redirecting...",
        "success"
      );

    } else {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      showAuthMessage(
        "Login successful. Redirecting...",
        "success"
      );

    }


    setTimeout(() => {

      closeAuthModal();

      goToDashboard();

    }, 700);


  } catch (error) {

    showAuthMessage(
      getFirebaseErrorMessage(error),
      "error"
    );

    setButtonLoading(
      authSubmitButton,
      false
    );

  }

}


/* =========================================================
   GOOGLE AUTHENTICATION
========================================================= */

async function handleGoogleLogin() {

  clearAuthMessage();

  setButtonLoading(
    googleLoginButton,
    true,
    "Connecting..."
  );


  try {

    const provider =
      new GoogleAuthProvider();

    provider.setCustomParameters({
      prompt: "select_account"
    });


    await signInWithPopup(
      auth,
      provider
    );


    showAuthMessage(
      "Google login successful. Redirecting...",
      "success"
    );


    setTimeout(() => {

      closeAuthModal();

      goToDashboard();

    }, 700);


  } catch (error) {

    showAuthMessage(
      getFirebaseErrorMessage(error),
      "error"
    );

    setButtonLoading(
      googleLoginButton,
      false
    );

  }

}


/* =========================================================
   DASHBOARD REDIRECT
========================================================= */

function goToDashboard() {

  window.location.href =
    "dashboard.html";

}


/* =========================================================
   BUTTON EVENTS
========================================================= */


/* Navbar Login */

$("loginButton")?.addEventListener(
  "click",
  () => {
    openAuthModal("login");
  }
);


/* Navbar Create Account */

$("signupButton")?.addEventListener(
  "click",
  () => {
    openAuthModal("signup");
  }
);


/* Hero Create */

$("heroCreateButton")?.addEventListener(
  "click",
  () => {
    openAuthModal(
      "signup",
      "create"
    );
  }
);


/* Hero Login */

$("heroLoginButton")?.addEventListener(
  "click",
  () => {
    openAuthModal("login");
  }
);


/* CTA Create */

$("ctaCreateButton")?.addEventListener(
  "click",
  () => {
    openAuthModal(
      "signup",
      "create"
    );
  }
);


/* Footer Login */

$("footerLoginButton")?.addEventListener(
  "click",
  () => {
    openAuthModal("login");
  }
);


/* Footer Signup */

$("footerSignupButton")?.addEventListener(
  "click",
  () => {
    openAuthModal("signup");
  }
);


/* Close Modal */

$("closeAuthModal")?.addEventListener(
  "click",
  closeAuthModal
);


/* Switch Login / Signup */

authSwitchButton?.addEventListener(
  "click",
  () => {

    authMode =
      authMode === "login"
        ? "signup"
        : "login";

    updateAuthModal();

  }
);


/* Email Form */

authForm?.addEventListener(
  "submit",
  handleEmailAuthentication
);


/* Google */

googleLoginButton?.addEventListener(
  "click",
  handleGoogleLogin
);


/* =========================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
========================================================= */

authModal?.addEventListener(
  "click",
  (event) => {

    if (
      event.target === authModal
    ) {
      closeAuthModal();
    }

  }
);


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape" &&
      authModal?.classList.contains("active")
    ) {
      closeAuthModal();
    }

  }
);


/* =========================================================
   AUTH STATE LISTENER
========================================================= */

onAuthStateChanged(
  auth,
  (user) => {

    if (user) {

      console.log(
        "Authenticated user:",
        user.email || user.uid
      );

    } else {

      console.log(
        "No authenticated user."
      );

    }

  }
);


/* =========================================================
   PREVENT HASH JUMP FOR EMPTY LINKS
========================================================= */

document
  .querySelectorAll('a[href="#"]')
  .forEach((link) => {

    link.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
      }
    );

  });


/* =========================================================
   INITIALIZATION
========================================================= */

console.log(
  "CVBuilder authentication system initialized."
);
