import { SlidersHorizontal } from "lucide-react";
import SearchBar from "../../components/SearchBar/SearchBar";
import "./SearchPage.css";

export default function SearchView({ query, onQueryChange, onSearch, showFilters, onToggleFilters, zone, onZoneChange, zones, cuisine, onCuisineChange, cuisineTypes, budget, onBudgetChange, onReset, resultCount, children, t, localize }) {
  return (
    <section className="page-section">
      <span className="eyebrow">{t("findEyebrow")}</span>

      <h1 className="page-title">{t("searchTitle")}</h1>

      {/* Search + filter toggle share one row */}
      <div className="search-row">
        <SearchBar value={query} onChange={onQueryChange} onSubmit={onSearch} t={t} />

        <button
          className={`filter-button${showFilters ? " is-active" : ""}`}
          type="button"
          onClick={onToggleFilters}
          aria-expanded={showFilters}
          aria-controls="filter-panel"
          aria-label={t("filters")}
        >
          <SlidersHorizontal size={22} aria-hidden="true" />
        </button>
      </div>

      {/* Cuisine is now one-tap chips instead of a dropdown */}
      <div className="chip-row" role="group" aria-label={t("cuisineType")}>
        {cuisineTypes.map((item) => (
          <button
            key={item}
            type="button"
            className={`chip${cuisine === item ? " is-selected" : ""}`}
            aria-pressed={cuisine === item}
            onClick={() => onCuisineChange(item)}
          >
            {localize(item)}
          </button>
        ))}
      </div>

      {showFilters && (
        <div id="filter-panel" className="filter-panel">
          <label htmlFor="zone">{t("area")}</label>
          <select id="zone" value={zone} onChange={(event) => onZoneChange(event.target.value)}>
            {zones.map((item) => (
              <option key={item.value} value={item.value}>
                {localize(item.label)}
              </option>
            ))}
          </select>

          <label htmlFor="budget">{t("budgetPerPerson")}: ฿{budget}</label>
          <input id="budget" type="range" min="50" max="2000" step="50" value={budget} onChange={(event) => onBudgetChange(Number(event.target.value))} />

          <button className="button-secondary" type="button" onClick={onReset}>
            {t("reset")}
          </button>
        </div>
      )}

      <div className="results-heading">
        <h2>{t("results")}</h2>
        <span>{resultCount} {t("restaurantCount")}</span>
      </div>

      {children}
    </section>
  );
}
