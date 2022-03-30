import { Injectable } from "@nestjs/common";
import { FieldSet, Records } from "airtable";
import { AirtableBase } from "airtable/lib/airtable_base";
import { chunk, flatten } from "lodash";

import { AirtableException, InjectAirtable } from "./lib/common";

@Injectable()
export class AirtableService {
  constructor(@InjectAirtable() private readonly airtableBase: AirtableBase) {}

  async createRecord(tableName: string, data: Record<string, any>) {
    try {
      return await this.airtableBase(tableName).create(data);
    } catch (error) {
      throw new AirtableException(error);
    }
  }

  async createRecords(
    tableName: string,
    recordsToCreate: Record<string, any>[],
  ) {
    try {
      // airtable expects a "fields" property when creating multiple records
      const recordsWithFields = recordsToCreate.map((recordToCreate) => ({
        fields: recordToCreate,
      }));

      const createdRecords: Records<FieldSet>[] = [];

      // airtable only allows creating 10 records at a time
      const chunkedRecordData = chunk(recordsWithFields, 10);
      for (const chunkOfDtos of chunkedRecordData) {
        const records = await this.airtableBase(tableName).create(chunkOfDtos);
        createdRecords.push(records);
      }

      // [[record1, record2], [record3, record4]] => [record1, record2, record3, record4]
      return flatten(createdRecords);
    } catch (error) {
      throw new AirtableException(error);
    }
  }

  async findAllRecords(tableName: string) {
    try {
      return await this.airtableBase(tableName).select().all();
    } catch (error) {
      throw new AirtableException(error);
    }
  }

  async findRecordById(tableName: string, id: string) {
    try {
      return await this.airtableBase(tableName).find(id);
    } catch (error) {
      throw new AirtableException(error);
    }
  }

  async findRecordsBySelectQuery(
    tableName: string,
    selectQuery: Record<string, any>,
  ) {
    try {
      return await this.airtableBase(tableName).select(selectQuery).all();
    } catch (error) {
      throw new AirtableException(error);
    }
  }

  async findRecordByIdAndUpdate(
    tableName: string,
    id: string,
    data: Record<string, any>,
  ) {
    try {
      return await this.airtableBase(tableName).update(id, data);
    } catch (error) {
      throw new AirtableException(error);
    }
  }

  async findRecordByIdAndDelete(tableName: string, id: string) {
    try {
      await this.airtableBase(tableName).destroy(id);
    } catch (error) {
      throw new AirtableException(error);
    }
  }

  async getTable(tableName: string) {
    try {
      return this.airtableBase(tableName);
    } catch (error) {
      throw new AirtableException(error);
    }
  }

  getBaseId() {
    return this.airtableBase.getId();
  }
}
