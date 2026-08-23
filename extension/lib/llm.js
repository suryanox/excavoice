window.LLM = {
  async complete(config, messages) {
    const base = (config.baseUrl || "").replace(/\/+$/, "");
    if (!base) throw new Error("Missing API base URL");
    const url = base + "/chat/completions";

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + (config.apiKey || ""),
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        temperature: 0,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error("LLM request failed (" + res.status + "): " + text.slice(0, 200));
    }

    const data = await res.json();
    const content = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (!content) throw new Error("Empty response from LLM");
    return content.trim();
  },
};
