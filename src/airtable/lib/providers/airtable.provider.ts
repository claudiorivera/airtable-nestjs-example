import { Provider } from "@nestjs/common";

import { AIRTABLE_CONFIG_TOKEN } from "../common/airtable.constants";
import { createAirtableClient } from "../common/airtable.utils";
import { AirtableModuleOptions } from "../interfaces/airtable-options.interface";

export function createAirtableProviders(
  options: AirtableModuleOptions,
): Provider {
  return {
    provide: AIRTABLE_CONFIG_TOKEN,
    useValue: createAirtableClient(options),
  };
}
