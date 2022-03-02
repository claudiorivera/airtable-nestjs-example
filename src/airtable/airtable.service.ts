import { Injectable, Logger } from "@nestjs/common";
import { AirtableBase } from "airtable/lib/airtable_base";

import { InjectAirtable } from "./lib/common/airtable.decorator";

@Injectable()
export class AirtableService {
  constructor(@InjectAirtable() private readonly airtableBase: AirtableBase) {}

  async findAll({ tableName }) {
    try {
      const query = this.airtableBase(tableName + "1").select();
      const rows = await query.all();
      Logger.debug(`Found ${rows.length} rows`, "AirtableService.findAll");
      return rows;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }
}
