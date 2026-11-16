const GOOGLE_IDENTITY_SCRIPT = "https://accounts.google.com/gsi/client";

function loadGoogleIdentityScript() {
  if (window.google?.accounts?.id) return Promise.resolve();

  const existingScript = document.querySelector(`script[src="${GOOGLE_IDENTITY_SCRIPT}"]`);
  if (existingScript) {
    return new Promise((resolve, reject) => {
      existingScript.addEventListener("load", resolve, { once: true });
      existingScript.addEventListener("error", () => reject(new Error("โหลด Google Login ไม่สำเร็จ")), { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = GOOGLE_IDENTITY_SCRIPT;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error("โหลด Google Login ไม่สำเร็จ"));
    document.head.appendChild(script);
  });
}

export async function initializeGoogleButton(container, onAuthenticated, onError, onStart = () => {}) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) {
    onError("ยังไม่ได้ตั้งค่า Google Client ID ในไฟล์ .env.local");
    return;
  }

  try {
    await loadGoogleIdentityScript();
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async ({ credential }) => {
        onStart();
        try {
          const response = await fetch("/api/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ credential }),
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error || "เข้าสู่ระบบไม่สำเร็จ");
          onAuthenticated(result);
        } catch (error) {
          onError(error.message);
        }
      },
    });
    window.google.accounts.id.renderButton(container, {
      theme: "outline",
      size: "large",
      width: 360,
      text: "continue_with",
      shape: "rectangular",
    });
  } catch (error) {
    onError(error.message);
  }
}
