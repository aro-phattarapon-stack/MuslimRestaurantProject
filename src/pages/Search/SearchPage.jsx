import SearchBar from "../../components/SearchBar/SearchBar";
import "./SearchPage.css";

export default function SearchView({
  query,
  onQueryChange,
  onSearch,
  resultCount,
  children,
  t,
}) {
  return (
    <section className="page-section">
      <span className="eyebrow">{t("findEyebrow")}</span>
      <h1 className="page-title">{t("searchTitle")}</h1>
      <SearchBar value={query} onChange={onQueryChange} onSubmit={onSearch} t={t} />
      <div className="results-heading"><h2>{t("results")}</h2><span>{resultCount} {t("restaurantCount")}</span></div>
      {children}
    </section>
  );
}
