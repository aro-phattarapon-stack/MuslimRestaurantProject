import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, X } from "lucide-react";

import "./AuthModal.css";

export default function AuthModal({ mode, onClose, onAuthenticated, t }) {
  const [view, setView] = useState(mode || "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function submit(event) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password || (view === "signup" && !name.trim())) {
      setError(view === "signup" ? t("errorRequired") : t("errorEmailPasswordRequired"));
      return;
    }
    if (password.length < 6) {
      setError(t("errorPasswordLength"));
      return;
    }

    const accounts = JSON.parse(localStorage.getItem("halal-accounts") || "[]");
    const existing = accounts.find((account) => account.email === normalizedEmail);
    if (view === "signup" && existing) {
      setError(t("errorEmailExists"));
      return;
    }
    if (view === "login" && (!existing || existing.password !== password)) {
      setError(t("errorInvalidCredentials"));
      return;
    }

    const account = view === "signup"
      ? { name: name.trim(), email: normalizedEmail, password }
      : existing;
    const nextAccounts = view === "signup" ? [...accounts, account] : accounts;
    localStorage.setItem("halal-accounts", JSON.stringify(nextAccounts));
    localStorage.setItem("halal-session", JSON.stringify(account));
    onAuthenticated({ name: account.name, email: account.email });
  }

  return (
    <div className="auth-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button className="auth-close" type="button" onClick={onClose} aria-label={t("close")}><X size={20} /></button>
        <div className="auth-mark"><LockKeyhole size={22} /></div>
        <span className="eyebrow">HALAL CHIANG RAI</span>
        <h1 id="auth-title">{view === "login" ? t("signIn") : t("signUp")}</h1>
        <p className="auth-subtitle">{t("favoriteRequiresLogin")}</p>
        <form className="auth-form" onSubmit={submit}>
          {view === "signup" && <label>{t("name")}<input value={name} onChange={(event) => setName(event.target.value)} placeholder={t("namePlaceholder")} autoComplete="name" /></label>}
          <label>{t("email")}<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={t("emailPlaceholder")} autoComplete="email" /></label>
          <label>{t("password")}<span className="password-field"><input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={t("passwordPlaceholder")} autoComplete={view === "login" ? "current-password" : "new-password"} /><button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={t("showPassword")}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="button-primary auth-submit" type="submit">{t("continue")}</button>
        </form>
        <button className="auth-switch" type="button" onClick={() => { setView((current) => current === "login" ? "signup" : "login"); setError(""); }}>
          {view === "login" ? t("switchToSignup") : t("switchToLogin")}
        </button>
        <p className="auth-note">{t("authNote")}</p>
      </section>
    </div>
  );
}
