import { Injectable, Logger } from "@nestjs/common";
import { AirtableBase } from "airtable/lib/airtable_base";

import { CreateRecordDto } from "./dto/create-record.dto";
import { FindAllRecordsDto } from "./dto/find-all-records.dto";
import { FindOneRecordDto } from "./dto/find-one-record.dto";
import { UpdateRecordDto } from "./dto/update-record.dto";
import { InjectAirtable } from "./lib/common";

@Injectable()
export class AirtableService {
  constructor(@InjectAirtable() private readonly airtableBase: AirtableBase) {}

  async create({ tableName, data }: CreateRecordDto) {
    try {
      const record = await this.airtableBase(tableName).create(data);
      return record;
    } catch (error) {
      Logger.error(error, "AirtableService.create");
      throw error;
    }
  }

  async findAll({ tableName }: FindAllRecordsDto) {
    try {
      const records = this.airtableBase(tableName).select().all();
      return records;
    } catch (error) {
      Logger.error(error, "AirtableService.findAll");
      throw error;
    }
  }

  async findOne({ tableName, id }: FindOneRecordDto) {
    try {
      const record = await this.airtableBase(tableName).find(id);
      return record;
    } catch (error) {
      Logger.error(error, "AirtableService.findOne");
      throw error;
    }
  }

  async update({ tableName, id, data }: UpdateRecordDto) {
    try {
      const record = await this.airtableBase(tableName).update(id, data);
      return record;
    } catch (error) {
      Logger.error(error, "AirtableService.update");
      throw error;
    }
  }

  async delete({ tableName, id }: FindOneRecordDto) {
    try {
      await this.airtableBase(tableName).destroy(id);
    } catch (error) {
      Logger.error(error, "AirtableService.delete");
      throw error;
    }
  }

  getBaseId() {
    return this.airtableBase.getId();
  }
}
