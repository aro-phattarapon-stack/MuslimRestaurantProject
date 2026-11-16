import { useState } from "react";
import { ArrowRight, MapPin, Sparkles, Search } from "lucide-react";
import "./HomePage.css";



function AiRecommendForm({
  onAiRecommend,
  aiMessage,
  aiLoading,
  t,
}) {
  const [aiPrompt, setAiPrompt] = useState("");

  function submitRecommendation(event) {
    event.preventDefault();

    if (!aiPrompt.trim() || aiLoading) return;

    onAiRecommend(aiPrompt);
  }

  return (
    <section className="ai-recommend-banner">

      {/* AI Banner Header */}
      <div className="ai-recommend-header">
        <div className="ai-recommend-icon">
          <Sparkles size={34} strokeWidth={1.8} />
        </div>

        <div className="ai-recommend-text">
          <h2>{t("aiTitle")}</h2>
          <p>{t("aiSubtitle")}</p>
        </div>
      </div>

      {/* AI Prompt Search */}
      <form
        className="ai-recommend-search"
        onSubmit={submitRecommendation}
      >
        <Search size={21} />


        <input
          type="text"
          value={aiPrompt}
          maxLength={500}
          onChange={(event) =>
            setAiPrompt(event.target.value)
          }
          placeholder={t("aiPromptPlaceholder")}
          aria-label={t("aiTitle")}
        />

        <button
          type="submit"
          disabled={!aiPrompt.trim() || aiLoading}
          aria-label="Get AI recommendation"
        >
          {aiLoading ? (
            <span className="ai-loading-spinner" />
          ) : (
            <Search size={22} />
          )}
        </button>
      </form>

      {/* AI Response Message */}
      {aiMessage && (
        <p className="ai-recommend-message" role="status">
          {aiMessage}
        </p>
      )}

    </section>
  );
}



export default function HomeView({
  onAiRecommend,
  aiMessage,
  aiLoading,
  zones,
  selectedZone,
  onZoneSelect,
  onShowAll,
  children,
  t,
}) {
  return (
    <main className="home-page">

      {/* AI Recommendation Banner */}
      <AiRecommendForm
        onAiRecommend={onAiRecommend}
        aiMessage={aiMessage}
        aiLoading={aiLoading}
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
                className={`zone-card ${selectedZone === item.value ? "selected" : ""
                  }`}
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
          <h2>ร้านอาหารใกล้คุณ</h2>

          <button type="button" onClick={onShowAll}>
            ดูทั้งหมด <ArrowRight size={16} />
          </button>
        </div>

        {children}
      </section>

    </main>
  );
}

