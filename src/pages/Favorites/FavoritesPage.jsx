import { Heart } from "lucide-react";
import RestaurantList from "../../components/restaurants/RestaurantList/RestaurantList";

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
      <section className="page-section favorites-page favorites-gate">
        <span className="eyebrow">{t("yourCollection")}</span>
        <h1 className="page-title">{t("favorites")}</h1>

        <div className="gate-card">
          <div className="gate-icon">
            <Heart size={28} aria-hidden="true" />
          </div>
          <h2>{t("loginToSave")}</h2>
          <p>{t("favoriteRequiresLogin")}</p>
          <button className="button-primary gate-button" type="button" onClick={onRequestLogin}>
            {t("signIn")}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section favorites-page">
      <span className="eyebrow">{t("yourCollection")}</span>

      <div className="favorites-heading">
        <h1 className="page-title">{t("favorites")}</h1>
        {restaurants.length > 0 && (
          <span className="favorites-count">
            {restaurants.length} {t("restaurantCount")}
          </span>
        )}
      </div>

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
