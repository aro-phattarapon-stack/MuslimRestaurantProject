import { ShieldCheck } from "lucide-react";
import "./AboutPage.css";

export default function InfoView({ t }) {
  return (
    <section className="page-section">
      <span className="eyebrow">{t("aboutEyebrow")}</span>
      <h1 className="page-title">{t("aboutTitle")}</h1>
      <div className="about-card about-card-featured"><div className="about-icon"><ShieldCheck size={27} /></div><h2>{t("aboutHeading")}</h2><p>{t("aboutText")}</p></div>
      <div className="about-card"><h3>{t("recommendation")}</h3><p>{t("recommendationText")}</p></div>
    </section>
  );
}
