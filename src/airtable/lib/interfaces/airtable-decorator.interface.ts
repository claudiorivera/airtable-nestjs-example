export interface AirtableDecorator {
  (
    target: Record<string, unknown>,
    key: string | symbol,
    index?: number | undefined,
  ): void;
}
