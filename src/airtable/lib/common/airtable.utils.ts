import * as Airtable from "airtable";
import { AirtableBase } from "airtable/lib/airtable_base";

import { AirtableModuleOptions } from "../interfaces/airtable-options.interface";

export const createAirtableClient = (
  options: AirtableModuleOptions,
): AirtableBase => {
  const airtable = new Airtable({
    apiKey: options.apiKey,
  });

  return airtable.base(options.baseId);
};
