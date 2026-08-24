import type { ChatMessage } from "../lib/llm";
import type { Logger } from "../lib/logger";
import type { ModelProvider } from "../lib/modelProviders";
import { formatError } from "../lib/logger";

export class DiagramGenerationError extends Error {}

export class DiagramService {
  private cursor = 0;

  constructor(
    private readonly provider: ModelProvider,
    private readonly complete: (model: string, messages: ChatMessage[]) => Promise<string>,
    private readonly logger: Logger,
    private readonly maxTries = 4,
  ) {}

  async generate(messages: ChatMessage[]): Promise<string> {
    const models = await this.provider.list();
    if (models.length === 0) {
      throw new DiagramGenerationError(
        "No models available. Check your /v1/models endpoint.",
      );
    }

    const attempts = Math.min(this.maxTries, models.length);

    for (let i = 0; i < attempts; i++) {
      const model = models[this.cursor % models.length];
      this.cursor++;

      try {
        this.logger.req(`Using model: ${model}`);
        const mermaid = (await this.complete(model, messages)).trim();
        this.logger.success("Generation successful.");
        return mermaid;
      } catch (err) {
        this.logger.error(`Model ${model} failed: ${formatError(err)}`);
      }
    }

    throw new DiagramGenerationError(`All ${attempts} model(s) failed.`);
  }
}
