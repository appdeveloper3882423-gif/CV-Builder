import { auth } from "./firebase-config.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";


/* =========================================================
   CV BUILDER - AUTHENTICATION SYSTEM
   ========================================================= */

const $ = (id) => document.getElementById(id);

let mode = "signup";


/* =========================================================
   OPEN / CLOSE AUTH MODAL
   ========================================================= */

function openAuth(nextMode = "signup") {
  mode = nextMode;

  updateAuth();

  const modal = $("authModal");

  if (modal) {
    modal.classList.add("active");
  }

  document.body.style.overflow = "hidden";

  setTimeout(() => {
    $("authEmail")?.focus();
  }, 80);
}


function closeAuth() {
  const modal = $("authModal");

  if (modal) {
    modal.classList.remove("active");
  }

  document.body.style.overflow = "";

  const message = $("authMessage");

  if (message) {
    message.className = "auth-message";
    message.textContent = "";
  }

  $("authForm")?.reset();
}


/* =========================================================
   UPDATE LOGIN / SIGNUP MODE
   ========================================================= */

function updateAuth() {
  const login = mode === "login";

  const title = $("authTitle");
  const subtitle = $("authSubtitle");
  const submitButton = $("authSubmitButton");
  const switchText = $("authSwitchText");
  const switchButton = $("authSwitchButton");

  if (title) {
    title.textContent = login
      ? "Welcome Back"
      : "Create Your Account";
  }

  if (subtitle) {
    subtitle.textContent = login
      ? "Login to access your CVBuilder dashboard."
      : "Start building your professional CV today.";
  }

  if (submitButton) {
    submitButton.textContent = login
      ? "Login"
      : "Create Account";
  }

  if (switchText) {
    switchText.textContent = login
      ? "Don't have an account?"
      : "Already have an account?";
  }

  if (switchButton) {
    switchButton.textContent = login
      ? "Create Account"
      : "Login";
  }
}


/* =========================================================
   AUTH MESSAGE
   ========================================================= */

function msg(text, type = "error") {
  const element = $("authMessage");

  if (!element) return;

  element.textContent = text;
  element.className = `auth-message show ${type}`;
}


/* =========================================================
   FIREBASE ERROR HANDLER
   ========================================================= */

function firebaseMessage(error) {

  console.error("=================================");
  console.error("FIREBASE AUTHENTICATION ERROR");
  console.error("Error Code:", error?.code);
  console.error("Error Message:", error?.message);
  console.error("Full Error:", error);
  console.error("=================================");


  const code = error?.code || "unknown";
  const message = error?.message || "No error message returned.";


  const map = {

    "auth/email-already-in-use":
      "An account already exists with this email address.",

    "auth/invalid-email":
      "Please enter a valid email address.",

    "auth/weak-password":
      "Password should be at least 6 characters.",

    "auth/invalid-credential":
      "Email or password is incorrect.",

    "auth/user-not-found":
      "No account was found with this email address.",

    "auth/wrong-password":
      "Email or password is incorrect.",

    "auth/user-disabled":
      "This account has been disabled.",

    "auth/too-many-requests":
      "Too many attempts. Please try again later.",

    "auth/network-request-failed":
      "Network error. Please check your internet connection.",

    "auth/operation-not-allowed":
      "This sign-in method is not enabled in Firebase.",

    "auth/invalid-api-key":
      "Firebase API key is invalid. Please check the Firebase configuration.",

    "auth/app-not-authorized":
      "This website is not authorized to use this Firebase project.",

    "auth/unauthorized-domain":
      "This website domain is not authorized in Firebase Authentication.",

    "auth/popup-closed-by-user":
      "Google sign-in was cancelled.",

    "auth/popup-blocked":
      "The Google login popup was blocked by your browser.",

    "auth/popup-operation-in-progress":
      "A Google login window is already open.",

    "auth/account-exists-with-different-credential":
      "An account already exists using another sign-in method.",

    "auth/credential-already-in-use":
      "This login credential is already associated with another account.",

    "auth/requires-recent-login":
      "Please login again and try this action.",

    "auth/internal-error":
      "Firebase returned an internal authentication error."

  };


  /*
     Known Firebase error:
     Show a friendly message.

     Unknown Firebase error:
     Show exact code + Firebase message.
  */

  if (map[code]) {
    return `${map[code]} (${code})`;
  }

  return `Firebase Error: ${code} — ${message}`;
}


/* =========================================================
   BUTTON LOADING
   ========================================================= */

function setButtonLoading(button, loading, loadingText, normalText) {

  if (!button) return;

  if (loading) {

    button.disabled = true;
    button.dataset.originalText =
      normalText || button.textContent;

    button.textContent = loadingText;

  } else {

    button.disabled = false;

    button.textContent =
      normalText ||
      button.dataset.originalText ||
      button.textContent;
  }
}


/* =========================================================
   NAVIGATION
   ========================================================= */

$("loginButton")?.addEventListener("click", () => {
  openAuth("login");
});


$("signupButton")?.addEventListener("click", () => {
  openAuth("signup");
});


$("heroLoginButton")?.addEventListener("click", () => {
  openAuth("login");
});


$("heroCreateButton")?.addEventListener("click", () => {
  openAuth("signup");
});


$("ctaCreateButton")?.addEventListener("click", () => {
  openAuth("signup");
});


$("footerLoginButton")?.addEventListener("click", () => {
  openAuth("login");
});


$("footerSignupButton")?.addEventListener("click", () => {
  openAuth("signup");
});


$("closeAuthModal")?.addEventListener("click", () => {
  closeAuth();
});


/* =========================================================
   SWITCH LOGIN / SIGNUP
   ========================================================= */

$("authSwitchButton")?.addEventListener("click", () => {

  mode = mode === "login"
    ? "signup"
    : "login";

  updateAuth();

});


/* =========================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
   ========================================================= */

$("authModal")?.addEventListener("click", (event) => {

  if (event.target.id === "authModal") {
    closeAuth();
  }

});


/* =========================================================
   ESCAPE KEY
   ========================================================= */

document.addEventListener("keydown", (event) => {

  if (
    event.key === "Escape" &&
    $("authModal")?.classList.contains("active")
  ) {
    closeAuth();
  }

});


/* =========================================================
   EMAIL / PASSWORD LOGIN + SIGNUP
   ========================================================= */

$("authForm")?.addEventListener("submit", async (event) => {

  event.preventDefault();


  const emailElement = $("authEmail");
  const passwordElement = $("authPassword");
  const button = $("authSubmitButton");


  if (!emailElement || !passwordElement || !button) {
    console.error("Authentication form elements are missing.");
    return;
  }


  const email = emailElement.value.trim();
  const password = passwordElement.value;


  /* ---------- Validation ---------- */

  if (!email) {
    msg("Please enter your email address.");
    return;
  }


  if (!password) {
    msg("Please enter your password.");
    return;
  }


  if (password.length < 6) {
    msg("Password should be at least 6 characters.");
    return;
  }


  /* ---------- Loading ---------- */

  const normalButtonText =
    mode === "login"
      ? "Login"
      : "Create Account";


  const loadingText =
    mode === "login"
      ? "Logging in..."
      : "Creating account...";


  setButtonLoading(
    button,
    true,
    loadingText,
    normalButtonText
  );


  try {

    let userCredential;


    /* ---------- LOGIN ---------- */

    if (mode === "login") {

      userCredential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

    }


    /* ---------- CREATE ACCOUNT ---------- */

    else {

      userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

    }


    /* ---------- SUCCESS ---------- */

    const user = userCredential.user;


    console.log(
      "Firebase Authentication Successful:",
      user
    );


    msg(
      mode === "login"
        ? "Login successful. Redirecting..."
        : "Account created successfully. Redirecting...",
      "success"
    );


    setTimeout(() => {

      window.location.href = "dashboard.html";

    }, 700);


  }


  /* ---------- ERROR ---------- */

  catch (error) {

    const errorText =
      firebaseMessage(error);


    msg(errorText, "error");


    setButtonLoading(
      button,
      false,
      "",
      normalButtonText
    );

  }

});


/* =========================================================
   GOOGLE LOGIN
   ========================================================= */

$("googleLoginButton")?.addEventListener(
  "click",
  async () => {

    const button = $("googleLoginButton");

    if (!button) return;


    setButtonLoading(
      button,
      true,
      "Connecting...",
      "Continue with Google"
    );


    try {

      const provider =
        new GoogleAuthProvider();


      provider.setCustomParameters({
        prompt: "select_account"
      });


      const result =
        await signInWithPopup(
          auth,
          provider
        );


      console.log(
        "Google Authentication Successful:",
        result.user
      );


      msg(
        "Google login successful. Redirecting...",
        "success"
      );


      setTimeout(() => {

        window.location.href =
          "dashboard.html";

      }, 700);


    }


    catch (error) {

      const errorText =
        firebaseMessage(error);


      msg(errorText, "error");


      setButtonLoading(
        button,
        false,
        "",
        "Continue with Google"
      );

    }

  }
);


/* =========================================================
   AUTH STATE
   ========================================================= */

onAuthStateChanged(auth, (user) => {

  if (user) {

    console.log(
      "Signed in:",
      user.email || user.uid
    );

  } else {

    console.log(
      "No authenticated user."
    );

  }

});


/* =========================================================
   INITIALIZE
   ========================================================= */

console.log(
  "CVBuilder Firebase Authentication initialized."
);
