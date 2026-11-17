import { Sparkles, Search } from "lucide-react";
import "../../pages/Home/HomePage.css";

export default function AiRecommendForm({
  aiPrompt = "",
  onAiPromptChange,
  onAiRecommend,
  aiMessage,
  aiLoading,
  t,
  compact = false,
}) {
  function submitRecommendation(event) {
    event.preventDefault();
    if (!aiPrompt.trim() || aiLoading) return;
    onAiRecommend(aiPrompt);
  }

  return (
    <section className={`ai-recommend-banner${compact ? " is-compact" : ""}`}>
      {!compact && (
        <div className="ai-recommend-header">
          <div className="ai-recommend-icon">
            <Sparkles size={34} strokeWidth={1.8} />
          </div>

          <div className="ai-recommend-text">
            <h2>{t("aiTitle")}</h2>
            <p>{t("aiSubtitle")}</p>
          </div>
        </div>
      )}

      <form className="ai-recommend-search" onSubmit={submitRecommendation}>
        <Sparkles size={20} aria-hidden="true" />

        <input
          type="text"
          value={aiPrompt}
          maxLength={500}
          onChange={(event) => onAiPromptChange(event.target.value)}
          placeholder={t("aiPromptPlaceholder")}
          aria-label={t("aiTitle")}
        />

        <button
          type="submit"
          disabled={!aiPrompt.trim() || aiLoading}
          aria-label={t("getAiRecommendation")}
        >
          {aiLoading ? (
            <span className="ai-loading-spinner" />
          ) : (
            <Search size={22} />
          )}
        </button>
      </form>

      {aiMessage && (
        <p className="ai-recommend-message" role="status">
          {aiMessage}
        </p>
      )}
    </section>
  );
}