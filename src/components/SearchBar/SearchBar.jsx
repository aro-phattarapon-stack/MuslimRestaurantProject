import { Search, X } from "lucide-react";

import "./SearchBar.css";

export default function SearchBar({ value, onChange, onSubmit, t }) {
  return (
    <form
      className="search-bar"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.();
      }}
    >
      <Search size={20} aria-hidden="true" />

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
          className="icon-button"
          aria-label={t("clearSearch")}
          onClick={() => onChange("")}
        >
          <X size={18} />
        </button>
      )}

      <button type="submit" className="search-submit">
        {t("search")}
      </button>
    </form>
  );
}