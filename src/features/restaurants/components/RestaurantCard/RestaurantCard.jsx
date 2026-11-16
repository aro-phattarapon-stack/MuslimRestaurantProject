import {
  Heart,
  MapPin,
  Clock,
  Utensils,
  ArrowUpRight,
  Check
} from "lucide-react";

import "./RestaurantCard.css";

function StatusBadge({ restaurant, t }) {
  if (restaurant.verified) {
    return (
      <span className="badge badge-certified">
        <Check size={14} strokeWidth={3} />
        {t("verified")}
      </span>
    );
  }

  return null;
}

export default function RestaurantCard({
  restaurant,
  isFavorite,
  onToggleFavorite,
  onClick,
  t,
  localize
}) {
  return (
    <article
      className="restaurant-card"
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`${t("restaurantDetails")}: ${restaurant.name}`}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
    >
      <div className="restaurant-card-topline">
        <span className="restaurant-type-icon" aria-hidden="true">
          <Utensils size={22} />
        </span>
        <span className="restaurant-type">{localize(restaurant.cuisine)}</span>
        <button
          type="button"
          className={`favorite-button ${
            isFavorite ? "is-favorite" : ""
          }`}
          aria-label={
            isFavorite ? t("saved") : t("save")
          }
          aria-pressed={isFavorite}
          onClick={(event) => {
            event.stopPropagation();
            onToggleFavorite(restaurant.id);
          }}
        >
          <Heart
            size={21}
            fill={isFavorite ? "currentColor" : "none"}
          />
        </button>
      </div>

      <div className="restaurant-content">
        <div className="restaurant-card-heading">
          <h3>{restaurant.name}</h3>
          <StatusBadge restaurant={restaurant} t={t} />
        </div>

        <div className="restaurant-meta">
          <span>
            <MapPin size={15} />
            {restaurant.zone === "MFU"
              ? t("districtMfu")
              : localize(restaurant.district)}
          </span>

          <span>
            <Utensils size={15} />
            {localize(restaurant.cuisine)}
          </span>
        </div>

        <div className="restaurant-footer">
          <span className="price-range">
            {localize(restaurant.priceLevel)}
          </span>

          <span className="opening-hours">
            <Clock size={14} />
            {restaurant.openingHours}
          </span>

          <ArrowUpRight className="card-arrow" size={18} aria-hidden="true" />
        </div>
      </div>
    </article>
  );
}