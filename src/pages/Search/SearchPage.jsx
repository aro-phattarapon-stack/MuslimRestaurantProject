import { ArrowRight, MapPin } from "lucide-react";
import AiRecommendForm from "../../components/AiRecommendForm/AiRecommendForm";
import "./SearchPage.css";

export default function HomeView({
  aiPrompt,
  onAiPromptChange,
  onAiRecommend,
  aiMessage,
  aiLoading,
  onClearAi,
  zones,
  selectedZone,
  onZoneSelect,
  onShowAll,
  children,
  t,
}) {
  return (
    <main className="home-page">
      {/* AI Recommendation Banner (ซิงค์กับหน้า Search) */}
      <AiRecommendForm
        aiPrompt={aiPrompt}
        onAiPromptChange={onAiPromptChange}
        onAiRecommend={onAiRecommend}
        aiMessage={aiMessage}
        aiLoading={aiLoading}
        onClearAi={onClearAi}
        t={t}
      />

      {/* Explore Areas */}
      <section className="zone-section">
        <div className="section-title-row">
          <div>
            <span className="eyebrow">{t("explore")}</span>
            <h2>{t("chooseArea")}</h2>
          </div>
        </div>

        <div className="zone-grid">
          {zones
            .filter((item) => item.value !== "ALL")
            .map((item) => (
              <button
                key={item.value}
                className={`zone-card ${selectedZone === item.value ? "selected" : ""}`}
                type="button"
                onClick={() => onZoneSelect(item.value)}
              >
                <MapPin size={20} />
                <span>{item.label}</span>
                <ArrowRight size={16} />
              </button>
            ))}
        </div>
      </section>

      {/* Restaurant Listing */}
      <section className="listing-section">
        <div className="home-section-heading">
          <h2>{t("nearbyRestaurants")}</h2>

          <button type="button" onClick={onShowAll}>
            {t("viewAll")} <ArrowRight size={16} />
          </button>
        </div>

        {children}
      </section>
    </main>
  );
}