import RestaurantList from "../../features/restaurants/components/RestaurantList/RestaurantList";

import "./FavoritesPage.css";

export default function FavoritesPage({
  restaurants,
  favorites,
  onToggleFavorite,
  onSelect,
  onReset,
  loggedIn,
  onRequestLogin,
  t,
  localize
}) {
  if (!loggedIn) {
    return (
      <section className="page-section favorites-gate">
        <span className="eyebrow">{t("yourCollection")}</span>
        <h1 className="page-title">{t("favorites")}</h1>
        <div className="empty-state">
          <h3>{t("loginToSave")}</h3>
          <p>{t("favoriteRequiresLogin")}</p>
          <button className="button-primary" type="button" onClick={onRequestLogin}>{t("signIn")}</button>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section">
      <span className="eyebrow">{t("yourCollection")}</span>
      <h1 className="page-title">{t("favorites")}</h1>
      <p className="section-description">{t("savedForLater")}</p>
      <RestaurantList
        restaurants={restaurants}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        onSelect={onSelect}
        onReset={onReset}
        t={t}
        localize={localize}
      />
    </section>
  );
}
