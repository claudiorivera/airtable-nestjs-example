import { Injectable } from "@nestjs/common";
import { AirtableBase } from "airtable/lib/airtable_base";

import { CreateRecordDto } from "./dto/create-record.dto";
import { AirtableException, InjectAirtable } from "./lib/common";

@Injectable()
export class AirtableService {
  constructor(@InjectAirtable() private readonly airtableBase: AirtableBase) {}

  async create(tableName: string, createRecordDto: CreateRecordDto) {
    try {
      const record = await this.airtableBase(tableName).create(createRecordDto);
      return record;
    } catch (error) {
      throw new AirtableException(error);
    }
  }

  async findAll(tableName: string) {
    try {
      const records = this.airtableBase(tableName).select().all();
      return records;
    } catch (error) {
      throw new AirtableException(error);
    }
  }

  async findOne(tableName: string, id: string) {
    try {
      const record = await this.airtableBase(tableName).find(id);
      return record;
    } catch (error) {
      throw new AirtableException(error);
    }
  }

  async update(
    tableName: string,
    id: string,
    createRecordDto: CreateRecordDto,
  ) {
    try {
      const record = await this.airtableBase(tableName).update(
        id,
        createRecordDto,
      );
      return record;
    } catch (error) {
      throw new AirtableException(error);
    }
  }

  async delete(tableName: string, id: string) {
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
