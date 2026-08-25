interface SpeechRecognitionAlternative {
  transcript: string;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  0: SpeechRecognitionAlternative;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResult[];
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getSpeechRecognition(): SpeechRecognitionCtor | null {
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export interface TranscriptHandlers {
  onStart?: () => void;
  onPartial?: (text: string) => void;
  onFinal: (text: string) => void;
  onError?: (error: string) => void;
}

export function startTranscription(
  handlers: TranscriptHandlers,
  lang: string,
  pauseSeconds = 5,
): () => void {
  const Ctor = getSpeechRecognition();
  if (!Ctor) {
    handlers.onError?.("Speech API unavailable");
    return () => {};
  }

  const recognition = new Ctor();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = lang;

  let transcript = "";
  let silenceTimer: number | undefined;
  let stopped = false;

  const finalize = () => {
    if (stopped || !transcript.trim()) return;
    stopped = true;
    window.clearTimeout(silenceTimer);
    recognition.stop();
    handlers.onFinal(transcript.trim());
  };

  const restartSilenceTimer = () => {
    window.clearTimeout(silenceTimer);
    silenceTimer = window.setTimeout(finalize, pauseSeconds * 1000);
  };

  recognition.onstart = () => handlers.onStart?.();
  recognition.onresult = (event) => {
    let interim = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const r = event.results[i];
      if (r.isFinal) transcript += r[0].transcript + " ";
      else interim += r[0].transcript;
    }
    handlers.onPartial?.(transcript + interim);
    restartSilenceTimer();
  };
  recognition.onerror = (event) => handlers.onError?.(event.error);
  recognition.onend = () => {
    if (!stopped && transcript.trim()) restartSilenceTimer();
  };

  recognition.start();
  return () => {
    stopped = true;
    window.clearTimeout(silenceTimer);
    recognition.stop();
  };
}
