import { Search as SearchIcon } from "lucide-react";

import RestaurantCard from "../RestaurantCard/RestaurantCard";

import "./RestaurantList.css";

export default function RestaurantList({
  restaurants,
  favorites,
  onToggleFavorite,
  onSelect,
  onReset,
  t,
  localize
}) {
  if (restaurants.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state-icon">
          <SearchIcon size={28} />
        </span>
        <h3>{t("noMatchingRestaurants")}</h3>
        <p>{t("tryAdjustingFilters")}</p>
        <button className="button-secondary" type="button" onClick={onReset}>
          {t("clearFilters")}
        </button>
      </div>
    );
  }

  return (
    <div className="restaurant-list">
      {restaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          restaurant={restaurant}
          isFavorite={favorites.includes(restaurant.id)}
          onToggleFavorite={onToggleFavorite}
          onClick={() => onSelect(restaurant)}
          t={t}
          localize={localize}
        />
      ))}
    </div>
  );
}
