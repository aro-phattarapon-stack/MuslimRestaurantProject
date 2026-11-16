import { SlidersHorizontal } from "lucide-react";
import SearchBar from "../../components/SearchBar/SearchBar";
import "./SearchPage.css";

export default function SearchView({ query, onQueryChange, onSearch, showFilters, onToggleFilters, zone, onZoneChange, zones, cuisine, onCuisineChange, cuisineTypes, budget, onBudgetChange, onReset, resultCount, children, t, localize }) {
  return (
    <section className="page-section">
      <span className="eyebrow">{t("findEyebrow")}</span>
      <h1 className="page-title">{t("searchTitle")}</h1>
      <SearchBar value={query} onChange={onQueryChange} onSubmit={onSearch} t={t} />
      <button className="filter-toggle" type="button" onClick={onToggleFilters} aria-expanded={showFilters}><SlidersHorizontal size={18} /> {t("filters")} <span>{showFilters ? t("hideFilters") : t("adjustSearch")}</span></button>
      {showFilters && <div className="filter-panel"><label htmlFor="zone">{t("area")}</label><select id="zone" value={zone} onChange={(event) => onZoneChange(event.target.value)}>{zones.map((item) => <option key={item.value} value={item.value}>{localize(item.label)}</option>)}</select><label htmlFor="cuisine">{t("cuisineType")}</label><select id="cuisine" value={cuisine} onChange={(event) => onCuisineChange(event.target.value)}>{cuisineTypes.map((item) => <option key={item} value={item}>{localize(item)}</option>)}</select><label htmlFor="budget">{t("budgetPerPerson")}: ฿{budget}</label><input id="budget" type="range" min="50" max="2000" step="50" value={budget} onChange={(event) => onBudgetChange(Number(event.target.value))} /><button className="button-secondary" type="button" onClick={onReset}>{t("reset")}</button></div>}
      <div className="results-heading"><h2>{t("results")}</h2><span>{resultCount} {t("restaurantCount")}</span></div>
      {children}
    </section>
  );
}
