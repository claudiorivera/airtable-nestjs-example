import { Injectable } from "@nestjs/common";
import { FieldSet, Records } from "airtable";
import { AirtableBase } from "airtable/lib/airtable_base";
import { chunk, flatten } from "lodash";

import { InjectAirtable } from "./lib/common";

@Injectable()
export class AirtableService {
  constructor(@InjectAirtable() private readonly airtableBase: AirtableBase) {}

  createRecord = async (tableName: string, data: Record<string, any>) =>
    await this.airtableBase(tableName).create(data);

  createRecords = async (
    tableName: string,
    recordsToCreate: Record<string, any>[],
  ) => {
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
  };

  findAllRecords = async (tableName: string) =>
    await this.airtableBase(tableName).select().all();

  findRecordById = async (tableName: string, id: string) =>
    await this.airtableBase(tableName).find(id);

  findRecordsBySelectQuery = async (
    tableName: string,
    selectQuery: Record<string, any>,
  ) => await this.airtableBase(tableName).select(selectQuery).all();

  findRecordByIdAndUpdate = async (
    tableName: string,
    id: string,
    data: Record<string, any>,
  ) => await this.airtableBase(tableName).update(id, data);

  findRecordByIdAndDelete = async (tableName: string, id: string) =>
    await this.airtableBase(tableName).destroy(id);

  getBaseId = () => this.airtableBase.getId();
}
