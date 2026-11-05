import { Globe2, Heart, LogOut, Mail, UserRound } from "lucide-react";

import "./AccountPage.css";

export default function AccountPage({ account, favoritesCount, language, onLanguageChange, onSignOut, t }) {
  return (
    <section className="page-section account-page">
      <span className="eyebrow">YOUR PROFILE</span>
      <h1 className="page-title">{t("accountTitle")}</h1>
      <p className="section-description">{t("accountSubtitle")}</p>
      <div className="account-hero">
        <div className="account-avatar"><UserRound size={30} /></div>
        <div><h2>{account.name}</h2><p><Mail size={14} /> {account.email}</p></div>
      </div>
      <div className="account-stats"><div><strong>{favoritesCount}</strong><span>{t("savedRestaurants")}</span></div><div><strong>CR</strong><span>{t("memberSince")}</span></div></div>
      <div className="account-card">
        <div className="account-row"><Globe2 size={19} /><span>{t("language")}</span><div className="language-switch"><button className={language === "th" ? "active" : ""} type="button" onClick={() => onLanguageChange("th")}>{t("thai")}</button><button className={language === "en" ? "active" : ""} type="button" onClick={() => onLanguageChange("en")}>{t("english")}</button></div></div>
      </div>
      <button className="account-signout" type="button" onClick={onSignOut}><LogOut size={18} /> {t("signOut")}</button>
      <div className="account-note"><Heart size={16} /> {t("favoriteRequiresLogin")}</div>
    </section>
  );
}
