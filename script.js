/* =====================================================
   CV BUILDER — MAIN JAVASCRIPT
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ===================================================
     ELEMENTS
     =================================================== */

  const authModal = document.getElementById("authModal");
  const modalOverlay = document.getElementById("modalOverlay");
  const closeModal = document.getElementById("closeModal");

  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");

  const heroCreateBtn = document.getElementById("heroCreateBtn");
  const heroLoginBtn = document.getElementById("heroLoginBtn");
  const ctaBtn = document.getElementById("ctaBtn");

  const footerLogin = document.getElementById("footerLogin");
  const footerSignup = document.getElementById("footerSignup");

  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  const authTitle = document.getElementById("authTitle");
  const authSubtitle = document.getElementById("authSubtitle");

  const switchText = document.getElementById("switchText");
  const switchAuth = document.getElementById("switchAuth");

  const googleLogin = document.getElementById("googleLogin");
  const facebookLogin = document.getElementById("facebookLogin");

  const themeToggle = document.getElementById("themeToggle");

  const categoryCards =
    document.querySelectorAll(".category-card");


  /* ===================================================
     AUTH MODAL
     =================================================== */

  function openAuth(mode = "login") {

    authModal.classList.add("show");

    document.body.style.overflow = "hidden";

    setAuthMode(mode);
  }


  function closeAuth() {

    authModal.classList.remove("show");

    document.body.style.overflow = "";
  }


  function setAuthMode(mode) {

    if (mode === "signup") {

      loginForm.classList.add("hidden");
      signupForm.classList.remove("hidden");

      authTitle.textContent = "Create Your Account";

      authSubtitle.textContent =
        "Create an account to save and manage your CVs.";

      switchText.textContent =
        "Already have an account?";

      switchAuth.textContent =
        "Login";

      switchAuth.dataset.mode = "login";

    } else {

      signupForm.classList.add("hidden");
      loginForm.classList.remove("hidden");

      authTitle.textContent = "Welcome Back";

      authSubtitle.textContent =
        "Login to continue building your CV.";

      switchText.textContent =
        "Don't have an account?";

      switchAuth.textContent =
        "Create Account";

      switchAuth.dataset.mode = "signup";
    }
  }


  loginBtn?.addEventListener("click", () => {
    openAuth("login");
  });


  heroLoginBtn?.addEventListener("click", () => {
    openAuth("login");
  });


  signupBtn?.addEventListener("click", () => {
    openAuth("signup");
  });


  footerLogin?.addEventListener("click", () => {
    openAuth("login");
  });


  footerSignup?.addEventListener("click", () => {
    openAuth("signup");
  });


  heroCreateBtn?.addEventListener("click", () => {
    openAuth("signup");
  });


  ctaBtn?.addEventListener("click", () => {
    openAuth("signup");
  });


  switchAuth?.addEventListener("click", () => {

    const mode =
      switchAuth.dataset.mode || "signup";

    setAuthMode(mode);
  });


  closeModal?.addEventListener("click", closeAuth);

  modalOverlay?.addEventListener("click", closeAuth);


  document.addEventListener("keydown", (event) => {

    if (
      event.key === "Escape" &&
      authModal.classList.contains("show")
    ) {
      closeAuth();
    }

  });


  /* ===================================================
     DEMO EMAIL LOGIN
     =================================================== */

  loginForm?.addEventListener("submit", (event) => {

    event.preventDefault();

    const email =
      document.getElementById("loginEmail").value.trim();

    const password =
      document.getElementById("loginPassword").value;


    if (!email || !password) {

      alert("Please enter your email and password.");

      return;
    }


    /*
      Firebase Authentication will be connected here.

      Example future flow:

      signInWithEmailAndPassword(
        auth,
        email,
        password
      )
    */


    alert(
      "Login system is ready for Firebase connection."
    );

  });


  /* ===================================================
     DEMO ACCOUNT CREATION
     =================================================== */

  signupForm?.addEventListener("submit", (event) => {

    event.preventDefault();

    const name =
      document.getElementById("signupName").value.trim();

    const email =
      document.getElementById("signupEmail").value.trim();

    const password =
      document.getElementById("signupPassword").value;

    const confirmPassword =
      document.getElementById("signupConfirm").value;


    if (!name || !email || !password || !confirmPassword) {

      alert("Please fill in all fields.");

      return;
    }


    if (password.length < 6) {

      alert(
        "Password must contain at least 6 characters."
      );

      return;
    }


    if (password !== confirmPassword) {

      alert("Passwords do not match.");

      return;
    }


    /*
      Firebase Authentication will be connected here.

      Future:

      createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
    */


    alert(
      "Account system is ready for Firebase connection."
    );

  });


  /* ===================================================
     GOOGLE LOGIN
     =================================================== */

  googleLogin?.addEventListener("click", () => {

    /*
      Firebase Google Authentication
      will be connected here.

      After configuration:

      const provider = new GoogleAuthProvider();

      signInWithPopup(auth, provider);
    */

    alert(
      "Google Login will be activated after Firebase setup."
    );

  });


  /* ===================================================
     FACEBOOK LOGIN
     =================================================== */

  facebookLogin?.addEventListener("click", () => {

    /*
      Firebase Facebook Authentication
      will be connected here.

      After configuration:

      const provider = new FacebookAuthProvider();

      signInWithPopup(auth, provider);
    */

    alert(
      "Facebook Login will be activated after Firebase setup."
    );

  });


  /* ===================================================
     CATEGORY SELECTION
     =================================================== */

  categoryCards.forEach((card) => {

    card.addEventListener("click", () => {

      const category =
        card.dataset.category;

      /*
        Later this will open the category-specific
        CV format selection page.

        Example:

        IT
        → ATS Developer
        → Modern Tech
        → Software Engineer

        Teaching
        → Academic
        → Modern Educator
        → Professional Teacher
      */

      alert(
        `Selected category: ${category}\n\nCategory-specific CV formats will appear here.`
      );

    });

  });


  /* ===================================================
     THEME
     =================================================== */

  let darkMode =
    localStorage.getItem("cvbuilder-theme") === "dark";


  function applyTheme() {

    if (darkMode) {

      document.body.classList.add("dark-mode");

      if (themeToggle) {
        themeToggle.textContent = "☀️";
      }

    } else {

      document.body.classList.remove("dark-mode");

      if (themeToggle) {
        themeToggle.textContent = "🌙";
      }
    }
  }


  themeToggle?.addEventListener("click", () => {

    darkMode = !darkMode;

    localStorage.setItem(
      "cvbuilder-theme",
      darkMode ? "dark" : "light"
    );

    applyTheme();

  });


  applyTheme();


  /* ===================================================
     SCROLL REVEAL
     =================================================== */

  const revealElements =
    document.querySelectorAll(
      ".feature-card, .category-card, .step-card"
    );


  const observer =
    new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add(
              "visible"
            );

            observer.unobserve(
              entry.target
            );

          }

        });

      },
      {
        threshold: 0.12
      }
    );


  revealElements.forEach((element) => {

    element.classList.add("reveal");

    observer.observe(element);

  });


  /* ===================================================
     ACTIVE NAVIGATION
     =================================================== */

  const navLinks =
    document.querySelectorAll(".nav-links a");


  navLinks.forEach((link) => {

    link.addEventListener("click", () => {

      navLinks.forEach((item) => {
        item.classList.remove("active");
      });

      link.classList.add("active");

    });

  });


  /* ===================================================
     PREVENT EMPTY HASH JUMP
     =================================================== */

  document.querySelectorAll('a[href="#"]').forEach((link) => {

    link.addEventListener("click", (event) => {

      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    });

  });

});
