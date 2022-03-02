import { Injectable } from "@nestjs/common";
import { AirtableBase } from "airtable/lib/airtable_base";

import { InjectAirtable } from "./lib/common/airtable.decorator";

@Injectable()
export class AirtableService {
  constructor(@InjectAirtable() private readonly airtableBase: AirtableBase) {}

  async findAll({ tableName }) {
    const query = this.airtableBase(tableName).select();
    const rows = await query.all();
    return rows;
  }
}
