import { fetchModels } from "./models";

export interface ModelProvider {
  list(): Promise<string[]>;
}

export class FixedModelProvider implements ModelProvider {
  constructor(private readonly model: string) {}

  async list(): Promise<string[]> {
    return this.model ? [this.model] : [];
  }
}

export class FreeModelProvider implements ModelProvider {
  private cache: string[] | null = null;

  constructor(
    private readonly baseUrl: string,
    private readonly apiKey: string,
  ) {}

  async list(): Promise<string[]> {
    if (!this.cache) {
      this.cache = await fetchModels(this.baseUrl, this.apiKey);
    }
    return this.cache;
  }
}
