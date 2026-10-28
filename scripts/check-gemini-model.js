// Confirms the chat model is available to your Gemini API project. Reads the key from the environment only.
// PowerShell:  $env:GEMINI_API_KEY = "<your key>"; node scripts/check-gemini-model.js
// Bash:        GEMINI_API_KEY=<your key> node scripts/check-gemini-model.js
const key = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
const headers = { "x-goog-api-key": key };

(async () => {
  if (!key) {
    console.error("GEMINI_API_KEY is not set in this terminal.");
    process.exitCode = 1;
    return;
  }
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}`, { headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error(`"${model}" is not available to this key (HTTP ${response.status} ${data?.error?.status || ""}).`);
    const list = await fetch("https://generativelanguage.googleapis.com/v1beta/models?pageSize=200", { headers }).then((r) => r.json()).catch(() => ({}));
    const usable = (list.models || []).filter((m) => (m.supportedGenerationMethods || []).includes("generateContent")).map((m) => m.name.replace("models/", ""));
    if (usable.length) console.error(`Models this key can use with generateContent:\n  ${usable.join("\n  ")}`);
    process.exitCode = 1;
    return;
  }
  const methods = data.supportedGenerationMethods || [];
  console.log(`OK: ${data.name} (${data.displayName || "no display name"}) is available.`);
  console.log(`generateContent supported: ${methods.includes("generateContent") ? "yes" : "NO"}`);
})();
