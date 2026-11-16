import { useState } from "react";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import SearchBar from "../../components/SearchBar/SearchBar";
import "./HomePage.css";

function AiRecommendForm({ onAiRecommend, aiMessage, aiLoading, t }) {
  const [aiPrompt, setAiPrompt] = useState("");

  function submitRecommendation(event) {
    event.preventDefault();
    onAiRecommend(aiPrompt);
  }

  return (
    <form className="ai-form" onSubmit={submitRecommendation}>
      <label htmlFor="ai-prompt">{t("aiLabel")}</label>
      <textarea id="ai-prompt" maxLength={500} value={aiPrompt} onChange={(event) => setAiPrompt(event.target.value)} placeholder="เช่น ร้านใกล้ มฟล. งบไม่เกิน 100 บาท" rows={2} />
      <button className="button-primary" type="submit" disabled={aiLoading}><Sparkles size={18} /> {aiLoading ? "กำลังค้นหา..." : t("aiButton")}</button>
      {aiMessage && <p className="form-message" role="status">{aiMessage}</p>}
    </form>
  );
}

export default function HomeView({ query, onQueryChange, onSearch, onAiRecommend, aiMessage, aiLoading, zones, selectedZone, onZoneSelect, onShowAll, children, t }) {
  return (
    <>
      <section className="hero-section">
        <span className="eyebrow"><Sparkles size={15} /> {t("heroEyebrow")}</span>
        <h1>{t("heroTitle")}</h1>
        <p>{t("heroDescription")}</p>
        <button className="hero-link" type="button" onClick={onShowAll}>{t("viewAll")} <ArrowRight size={17} /></button>
      </section>
      <section className="ai-section">
        <div className="section-heading"><div className="ai-icon"><Sparkles size={21} /></div><div><h2>{t("aiTitle")}</h2></div></div>
        <AiRecommendForm onAiRecommend={onAiRecommend} aiMessage={aiMessage} aiLoading={aiLoading} t={t} />
      </section>
      <section className="zone-section">
        <div className="section-title-row"><div><span className="eyebrow">{t("explore")}</span><h2>{t("chooseArea")}</h2></div></div>
        <div className="zone-grid">{zones.filter((item) => item.value !== "ALL").map((item) => <button key={item.value} className={`zone-card ${selectedZone === item.value ? "selected" : ""}`} type="button" onClick={() => onZoneSelect(item.value)}><MapPin size={20} /><span>{item.label}</span><ArrowRight size={16} /></button>)}</div>
      </section>
      <section className="listing-section">
        <div className="section-title-row"><div><span className="eyebrow">{t("discover")}</span><h2>{t("restaurants")}</h2></div><button className="text-button" type="button" onClick={onShowAll}>{t("viewAll")} <ArrowRight size={16} /></button></div>
        <p className="results-support">{t("featuredSupport")}</p>
        {children}
      </section>
    </>
  );
}
