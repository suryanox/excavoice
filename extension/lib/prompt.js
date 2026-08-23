window.Prompt = {
  buildMessages(transcript) {
    return [
      {
        role: "system",
        content:
          "You are a diagram generation assistant. Convert the user's spoken description " +
          "into a Mermaid diagram. Respond with ONLY the Mermaid code. No explanations, " +
          "no markdown code fences, no surrounding text.",
      },
      { role: "user", content: transcript },
    ];
  },
};
