import { Sparkles, Loader2, Send, X } from "lucide-react";

export default function AiAssistantBox({
  prompt,
  onPromptChange,
  onSubmit,
  aiMessage,
  aiLoading,
  onClearAi,
  t,
  compact = false, // ปรับขนาดให้กระชับขึ้นเมื่ออยู่หน้า Search
}) {
  const quickPrompts = [
    t("aiQuick1") || "ข้าวซอยแถว มฟล. งบไม่เกิน 100",
    t("aiQuick2") || "ร้านอาหารฮาลาลในเมือง มีที่ละหมาด",
    t("aiQuick3") || "โรตีและของหวานเปิดตอนนี้",
  ];

  function handleFormSubmit(e) {
    e.preventDefault();
    onSubmit(prompt);
  }

  return (
    <div className={`ai-box${compact ? " is-compact" : ""}`}>
      <div className="ai-box-header">
        <span className="ai-badge">
          <Sparkles size={14} /> AI Halal Concierge
        </span>
        {(aiMessage || prompt) && onClearAi && (
          <button type="button" className="ai-clear-btn" onClick={onClearAi}>
            <X size={14} /> {t("clear") || "ล้างค่า"}
          </button>
        )}
      </div>

      <form className="ai-input-row" onSubmit={handleFormSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder={
            t("aiPlaceholder") ||
            "บอกสิ่งที่อยากกิน เช่น 'อาหารอินเดียแถวแม่สาย งบ 300'..."
          }
          disabled={aiLoading}
        />
        <button type="submit" className="ai-submit-btn" disabled={aiLoading}>
          {aiLoading ? <Loader2 size={18} className="spin" /> : <Send size={18} />}
        </button>
      </form>

      {/* ปุ่มคำสั่งลัด (Quick Prompts) */}
      {!compact && (
        <div className="ai-quick-chips">
          {quickPrompts.map((item, idx) => (
            <button
              key={idx}
              type="button"
              className="ai-chip"
              onClick={() => {
                onPromptChange(item);
                onSubmit(item);
              }}
            >
              {item}
            </button>
          ))}
        </div>
      )}

      {/* กล่องแสดงคำตอบ / สถานะการวิเคราะห์ของ AI (ซิงค์กันทั้ง 2 หน้า) */}
      {(aiLoading || aiMessage) && (
        <div className="ai-response-banner" role="status" aria-live="polite">
          {aiLoading ? (
            <span>
              <Loader2 size={15} className="spin" />{" "}
              {t("aiThinking") || "กำลังวิเคราะห์ร้านที่ตรงใจคุณ..."}
            </span>
          ) : (
            <p>
              <Sparkles size={15} /> {aiMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
}