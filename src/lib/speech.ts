export interface TranscriptHandlers {
  onStart?: () => void;
  onPartial?: (text: string) => void;
  onFinal: (text: string) => void;
  onError?: (error: string) => void;
}

// Wraps the Chrome Web Speech API (webkitSpeechRecognition).
export function startTranscription(handlers: TranscriptHandlers): () => void {
  const SR =
    (window as unknown as { SpeechRecognition?: new () => any }).SpeechRecognition ||
    (window as unknown as { webkitSpeechRecognition?: new () => any }).webkitSpeechRecognition;
  if (!SR) {
    handlers.onError?.("Speech API unavailable");
    return () => {};
  }

  const recognition = new SR();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = navigator.language || "en-US";

  let finalText = "";

  recognition.onstart = () => handlers.onStart?.();
  recognition.onresult = (event: any) => {
    let interim = "";
    finalText = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const r = event.results[i];
      if (r.isFinal) finalText += r[0].transcript;
      else interim += r[0].transcript;
    }
    handlers.onPartial?.(finalText + interim);
  };
  recognition.onerror = (event: any) => handlers.onError?.(event.error);
  recognition.onend = () => {
    if (finalText.trim()) handlers.onFinal(finalText.trim());
  };

  recognition.start();
  return () => recognition.stop();
}
