import {
  X,
  MapPin,
  Clock,
  Heart,
  Navigation,
  Utensils,
  Car,
  Check
} from "lucide-react";

import { openGoogleMaps } from "../../../utils/googleMaps";

import "./RestaurantDetail.css";

export default function RestaurantDetail({
  restaurant,
  isFavorite,
  onToggleFavorite,
  onClose,
  t,
  localize
}) {
  if (!restaurant) return null;

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
      >
        <header className="detail-header">
          <span className="eyebrow">{t("restaurantDetails")}</span>

          <button
            type="button"
            className="icon-button"
            aria-label={t("closeDetails")}
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </header>

        <div className="detail-identity">
          <span className="detail-identity-icon" aria-hidden="true">
            <Utensils size={30} />
          </span>
          <div>
            <span className="detail-category">{localize(restaurant.cuisine)}</span>
            <strong>{localize(restaurant.priceLevel)}</strong>
          </div>
        </div>

        <div className="detail-body">
          {restaurant.verified && (
            <span className="badge badge-certified">
              <Check size={14} strokeWidth={3} />
              {t("verified")}
            </span>
          )}

          <h2 id="detail-title">{restaurant.name}</h2>

          <p className="detail-description">
            {restaurant.description}
          </p>

          <div className="detail-info-row">
            <MapPin size={18} />
            <span>
              {restaurant.address || restaurant.district} ·{" "}
              {restaurant.zone === "MFU"
                ? t("districtMfuLong")
                : restaurant.zone === "CITY"
                  ? t("districtCity")
                  : restaurant.zone === "MAESAI"
                    ? t("districtMaeSai")
                    : t("provinceChiangRai")}
            </span>
          </div>

          <div className="detail-info-row">
            <Clock size={18} />
            <span>{restaurant.openingHours}</span>
          </div>

          <div className="detail-section">
            <h3>{t("menuAndPrice")}</h3>

            {restaurant.menu?.length ? (
              <ul className="menu-list">
                {restaurant.menu.map((item, index) => (
                  <li key={`${item.name}-${index}`}>
                    <span>{item.name}</span>
                    <strong>
                      {item.price != null
                        ? `฿${item.price}`
                        : t("priceUnavailable")}
                    </strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted-text">
                {t("menuUnavailable")}
              </p>
            )}
          </div>

          <div className="detail-actions">
            <button
              type="button"
              className="button-secondary"
              onClick={() => onToggleFavorite(restaurant.id)}
            >
              <Heart
                size={19}
                fill={isFavorite ? "currentColor" : "none"}
              />
              {isFavorite ? t("saved") : t("save")}
            </button>

            <button
              type="button"
              className="button-primary"
              onClick={() => openGoogleMaps(restaurant)}
            >
              <Navigation size={19} />
              {t("navigate")}
            </button>
          </div>

          <p className="detail-footnote">
            <Car size={14} />
            {t("openMapsHint")}
          </p>
        </div>
      </section>
    </div>
  );
}