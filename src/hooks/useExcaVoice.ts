import { useCallback, useMemo, useRef, useState } from "react";
import { getConfig } from "../lib/storage";
import { buildMessages, complete } from "../lib/llm";
import { startTranscription } from "../lib/speech";
import { sendToExcalidraw } from "../lib/excalidraw";
import { FixedModelProvider, FreeModelProvider } from "../lib/modelProviders";
import { DiagramService } from "../services/DiagramService";
import { useConfig } from "./useConfig";
import { useLogger } from "./useLogger";

export function useExcaVoice() {
  const logger = useLogger();
  const config = useConfig(logger);
  const [live, setLive] = useState("");
  const [listening, setListening] = useState(false);

  const stopRef = useRef<(() => void) | null>(null);

  const service = useMemo(
    () =>
      new DiagramService(
        config.freeModels
          ? new FreeModelProvider(config.baseUrl, config.apiKey)
          : new FixedModelProvider(config.model),
        (model, messages) =>
          complete(
            { baseUrl: config.baseUrl, apiKey: config.apiKey, model },
            messages,
          ),
        logger,
      ),
    [config.baseUrl, config.apiKey, config.model, config.freeModels, logger],
  );

  const handleTranscript = useCallback(
    async (text: string) => {
      const cfg = await getConfig();
      if (!cfg?.baseUrl || !cfg?.apiKey) {
        logger.error(
          "Missing API configuration. Open the config (gear) and save your settings.",
        );
        return;
      }

      const messages = buildMessages(text);
      try {
        const mermaid = await service.generate(messages);
        await sendToExcalidraw(mermaid);
      } catch (err) {
        logger.error("Failed to generate or insert diagram: " + String(err));
      }
    },
    [logger, service],
  );

  const startListening = useCallback(
    (onOpenLogs: () => void) => {
      onOpenLogs();
      setLive("");
      stopRef.current = startTranscription({
        onStart: () => logger.info("Microphone permission granted. Listening…"),
        onPartial: (t) => setLive(t),
        onFinal: (t) => {
          setListening(false);
          logger.info("Transcript: " + t);
          void handleTranscript(t);
        },
        onError: (e) => {
          setListening(false);
          logger.error("Speech error: " + e);
        },
      });
      setListening(true);
      logger.info("Waiting for microphone permission…");
    },
    [logger, handleTranscript],
  );

  const onMic = useCallback(
    (onOpenLogs: () => void) => {
      if (listening) {
        stopRef.current?.();
        stopRef.current = null;
        setListening(false);
        return;
      }
      startListening(onOpenLogs);
    },
    [listening, startListening],
  );

  return {
    ...config,
    logs: logger.logs,
    live,
    listening,
    showConfig: config.load,
    onSave: config.save,
    onMic,
  };
}
