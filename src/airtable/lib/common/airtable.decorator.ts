import { Inject } from "@nestjs/common";

import { AirtableDecorator } from "../interfaces/airtable-decorator.interface";
import { AIRTABLE_CONFIG_TOKEN } from "./airtable.constants";

export const InjectAirtable = (): AirtableDecorator =>
  Inject(AIRTABLE_CONFIG_TOKEN);
