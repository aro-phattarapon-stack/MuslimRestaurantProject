import { Globe2, LogOut, Mail, UserRound } from "lucide-react";

import "./AccountPage.css";

export default function AccountPage({ account, favoritesCount, language, onLanguageChange, onSignOut, t }) {
  return (
    <section className="page-section account-page">
      <span className="eyebrow">{t("yourProfile")}</span>
      <h1 className="page-title">{t("accountTitle")}</h1>
      <p className="section-description">{t("accountSubtitle")}</p>

      <div className="account-hero">
        <div className="account-avatar">
          <UserRound size={34} aria-hidden="true" />
        </div>
        <div className="account-identity">
          <h2>{account.name}</h2>
          <p>
            <Mail size={16} aria-hidden="true" />
            <span>{account.email}</span>
          </p>
        </div>
      </div>

      <div className="account-stats">
        <div>
          <strong>{favoritesCount}</strong>
          <span>{t("savedRestaurants")}</span>
        </div>
        <div>
          <strong>CR</strong>
          <span>{t("memberSince")}</span>
        </div>
      </div>

      <div className="account-card">
        <div className="account-row">
          <span className="account-row-icon">
            <Globe2 size={22} aria-hidden="true" />
          </span>
          <span className="account-row-label">{t("language")}</span>
          <div className="language-switch" role="group" aria-label={t("language")}>
            <button
              className={language === "th" ? "active" : ""}
              type="button"
              aria-pressed={language === "th"}
              onClick={() => onLanguageChange("th")}
            >
              {t("thai")}
            </button>
            <button
              className={language === "en" ? "active" : ""}
              type="button"
              aria-pressed={language === "en"}
              onClick={() => onLanguageChange("en")}
            >
              {t("english")}
            </button>
          </div>
        </div>
      </div>

      <button className="account-signout" type="button" onClick={onSignOut}>
        <LogOut size={20} aria-hidden="true" />
        {t("signOut")}
      </button>
    </section>
  );
}
