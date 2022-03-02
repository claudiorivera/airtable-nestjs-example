import { ModuleMetadata, Type } from "@nestjs/common";

export interface AirtableModuleOptions {
  baseId: string;
  apiKey: string;
}

export interface AirtableModuleAsyncOptions
  extends Pick<ModuleMetadata, "imports"> {
  inject?: any[];
  useClass?: Type<AirtableOptionsFactory>;
  useExisting?: Type<AirtableOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<AirtableModuleOptions> | AirtableModuleOptions;
}

export interface AirtableOptionsFactory {
  createAirtableOptions():
    | Promise<AirtableModuleOptions>
    | AirtableModuleOptions;
}
