import { SlidersHorizontal } from "lucide-react";
import AiRecommendForm from "../../components/AiRecommendForm/AiRecommendForm";
import SearchBar from "../../components/SearchBar/SearchBar";
import "./SearchPage.css";

export default function SearchView({
  query,
  onQueryChange,
  onSearch,
  showFilters,
  onToggleFilters,
  cuisine,
  onCuisineChange,
  cuisineTypes,
  budget,
  onBudgetChange,
  onReset,
  resultCount,
  aiPrompt,
  onAiPromptChange,
  onAiRecommend,
  aiMessage,
  aiLoading,
  onClearAi,
  children,
  t,
  localize,
}) {
  return (
    <section className="page-section">
      <AiRecommendForm
        aiPrompt={aiPrompt}
        onAiPromptChange={onAiPromptChange}
        onAiRecommend={onAiRecommend}
        aiMessage={aiMessage}
        aiLoading={aiLoading}
        onClearAi={onClearAi}
        t={t}
      />
      <span className="eyebrow">{t("findEyebrow")}</span>
      <h1 className="page-title">{t("searchTitle")}</h1>
      <SearchBar value={query} onChange={onQueryChange} onSubmit={onSearch} t={t} />
      <button className="filter-toggle" type="button" onClick={onToggleFilters} aria-expanded={showFilters}>
        <SlidersHorizontal size={18} /> {t("filters")} <span>{showFilters ? t("hideFilters") : t("adjustSearch")}</span>
      </button>
      {showFilters && (
        <div className="filter-panel">
          <label htmlFor="cuisine">{t("cuisineType")}</label>
          <select id="cuisine" value={cuisine} onChange={(event) => onCuisineChange(event.target.value)}>
            {cuisineTypes.map((item) => <option key={item} value={item}>{localize(item)}</option>)}
          </select>
          <label htmlFor="budget">{t("budgetPerPerson")}: ฿{budget}</label>
          <input id="budget" type="range" min="50" max="2000" step="50" value={budget} onChange={(event) => onBudgetChange(Number(event.target.value))} />
          <button className="button-secondary" type="button" onClick={onReset}>{t("reset")}</button>
        </div>
      )}
      <div className="results-heading"><h2>{t("results")}</h2><span>{resultCount} {t("restaurantCount")}</span></div>
      {children}
    </section>
  );
}
