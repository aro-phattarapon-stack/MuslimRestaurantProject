import { Search, X } from "lucide-react";

import "./SearchBar.css";

export default function SearchBar({ value, onChange, onSubmit, t }) {
  return (
    <form
      className="search-bar"
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.();
      }}
    >
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={t("searchPlaceholder")}
        aria-label={t("searchRestaurants")}
      />

      {value && (
        <button
          type="button"
          className="icon-button search-clear"
          aria-label={t("clearSearch")}
          onClick={() => onChange("")}
        >
          <X size={18} aria-hidden="true" />
        </button>
      )}

      <button type="submit" className="search-submit" aria-label={t("searchRestaurants")}>
        <Search size={20} aria-hidden="true" />
      </button>
    </form>
  );
}
