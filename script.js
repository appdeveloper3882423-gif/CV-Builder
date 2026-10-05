import { auth } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  GoogleAuthProvider, signInWithPopup, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const $ = id => document.getElementById(id);
let mode = "signup";

function openAuth(nextMode="signup"){ mode=nextMode; updateAuth(); $("authModal")?.classList.add("active"); document.body.style.overflow="hidden"; setTimeout(()=>$("authEmail")?.focus(),80); }
function closeAuth(){ $("authModal")?.classList.remove("active"); document.body.style.overflow=""; $("authMessage").className="auth-message"; $("authMessage").textContent=""; $("authForm")?.reset(); }
function updateAuth(){
  const login=mode==="login";
  $("authTitle").textContent=login?"Welcome Back":"Create Your Account";
  $("authSubtitle").textContent=login?"Login to access your CVBuilder dashboard.":"Start building your professional CV today.";
  $("authSubmitButton").textContent=login?"Login":"Create Account";
  $("authSwitchText").textContent=login?"Don't have an account?":"Already have an account?";
  $("authSwitchButton").textContent=login?"Create Account":"Login";
}
function msg(text,type="error"){const el=$("authMessage");el.textContent=text;el.className=`auth-message show ${type}`;}
function firebaseMessage(e){
  const c=e?.code||"";
  const map={
    "auth/email-already-in-use":"An account already exists with this email address.",
    "auth/invalid-email":"Please enter a valid email address.",
    "auth/weak-password":"Password should be at least 6 characters.",
    "auth/invalid-credential":"Email or password is incorrect.",
    "auth/user-not-found":"No account was found with this email address.",
    "auth/wrong-password":"Email or password is incorrect.",
    "auth/popup-closed-by-user":"Google sign-in was cancelled.",
    "auth/popup-blocked":"The Google login popup was blocked by your browser.",
    "auth/account-exists-with-different-credential":"An account already exists using another sign-in method.",
    "auth/too-many-requests":"Too many attempts. Please try again later.",
    "auth/network-request-failed":"Network error. Check your internet connection.",
    "auth/operation-not-allowed":"This sign-in method is not enabled in Firebase."
  };
  return map[c]||"Something went wrong. Please try again.";
}
$("loginButton")?.addEventListener("click",()=>openAuth("login"));
$("signupButton")?.addEventListener("click",()=>openAuth("signup"));
$("heroLoginButton")?.addEventListener("click",()=>openAuth("login"));
$("heroCreateButton")?.addEventListener("click",()=>openAuth("signup"));
$("ctaCreateButton")?.addEventListener("click",()=>openAuth("signup"));
$("footerLoginButton")?.addEventListener("click",()=>openAuth("login"));
$("footerSignupButton")?.addEventListener("click",()=>openAuth("signup"));
$("closeAuthModal")?.addEventListener("click",closeAuth);
$("authSwitchButton")?.addEventListener("click",()=>{mode=mode==="login"?"signup":"login";updateAuth();});
$("authModal")?.addEventListener("click",e=>{if(e.target.id==="authModal")closeAuth();});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeAuth();});

$("authForm")?.addEventListener("submit",async e=>{
  e.preventDefault();
  const email=$("authEmail").value.trim(), password=$("authPassword").value;
  if(!email||!password){msg("Please complete both fields.");return;}
  if(password.length<6){msg("Password should be at least 6 characters.");return;}
  const btn=$("authSubmitButton"); btn.disabled=true; btn.textContent=mode==="login"?"Logging in...":"Creating account...";
  try{
    if(mode==="login") await signInWithEmailAndPassword(auth,email,password);
    else await createUserWithEmailAndPassword(auth,email,password);
    msg("Success. Redirecting...","success");
    setTimeout(()=>location.href="dashboard.html",500);
  }catch(err){msg(firebaseMessage(err));btn.disabled=false;btn.textContent=mode==="login"?"Login":"Create Account";}
});
$("googleLoginButton")?.addEventListener("click",async()=>{
  const btn=$("googleLoginButton");btn.disabled=true;btn.textContent="Connecting...";
  try{
    const provider=new GoogleAuthProvider();provider.setCustomParameters({prompt:"select_account"});
    await signInWithPopup(auth,provider);location.href="dashboard.html";
  }catch(err){msg(firebaseMessage(err));btn.disabled=false;btn.textContent="Continue with Google";}
});
onAuthStateChanged(auth,user=>{
  if(user){
    console.log("Signed in:",user.email||user.uid);
    // If the visitor is already authenticated, open their dashboard/profile
    // instead of showing the public login page again.
    if(location.pathname.endsWith("/index.html") || location.pathname.endsWith("/")){
      location.replace("dashboard.html");
    }
  }
});
