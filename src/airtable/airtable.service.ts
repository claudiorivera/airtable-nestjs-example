import { Injectable } from "@nestjs/common";
import { AirtableBase } from "airtable/lib/airtable_base";

import { CreateRecordDto } from "./dto/create-record.dto";
import { FindAllRecordsDto } from "./dto/find-all-records.dto";
import { FindOneRecordDto } from "./dto/find-one-record.dto";
import { UpdateRecordDto } from "./dto/update-record.dto";
import { InjectAirtable } from "./lib/common";
import { AirtableException } from "./lib/interfaces";

@Injectable()
export class AirtableService {
  constructor(@InjectAirtable() private readonly airtableBase: AirtableBase) {}

  async create({ tableName, data }: CreateRecordDto) {
    try {
      const record = await this.airtableBase(tableName).create(data);
      return record;
    } catch (error) {
      throw new AirtableException(error);
    }
  }

  async findAll({ tableName }: FindAllRecordsDto) {
    try {
      const records = this.airtableBase(tableName).select().all();
      return records;
    } catch (error) {
      throw new AirtableException(error);
    }
  }

  async findOne({ tableName, id }: FindOneRecordDto) {
    try {
      const record = await this.airtableBase(tableName).find(id);
      return record;
    } catch (error) {
      throw new AirtableException(error);
    }
  }

  async update({ tableName, id, data }: UpdateRecordDto) {
    try {
      const record = await this.airtableBase(tableName).update(id, data);
      return record;
    } catch (error) {
      throw new AirtableException(error);
    }
  }

  async delete({ tableName, id }: FindOneRecordDto) {
    try {
      await this.airtableBase(tableName).destroy(id);
    } catch (error) {
      throw new AirtableException(error);
    }
  }

  getBaseId() {
    return this.airtableBase.getId();
  }
}
