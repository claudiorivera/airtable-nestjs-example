import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { FieldSet, Record, Records } from "airtable";
import { AirtableService } from "src/airtable/airtable.service";

import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { Todo } from "./interfaces/todo.interface";
import { TodoRequestOptions } from "./interfaces/todo-request-options.interface";

@Injectable()
export class TodosService {
  airtableTableName = "todos";
  constructor(private airtableService: AirtableService) {}

  createTodo = async (
    createTodoDto: CreateTodoDto,
    options?: TodoRequestOptions,
  ): Promise<Todo | Record<FieldSet>> => {
    try {
      const record = await this.airtableService.createRecord(
        this.airtableTableName,
        createTodoDto,
      );
      return options?.returnAirtableRecord
        ? record
        : this.todoEntityFromAirtableRecord(record);
    } catch (error) {
      switch (error.statusCode) {
        case 422:
          throw new HttpException(
            error.message,
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        default:
          throw error;
      }
    }
  };

  findAllTodos = async (
    options?: TodoRequestOptions,
  ): Promise<Todo[] | Records<FieldSet>> => {
    try {
      const records = await this.airtableService.findAllRecords(
        this.airtableTableName,
      );
      if (options?.returnAirtableRecord) {
        return records;
      } else {
        return records.map((record) =>
          this.todoEntityFromAirtableRecord(record),
        );
      }
    } catch (error) {
      switch (error.statusCode) {
        case 404:
          throw new NotFoundException(
            `Table '${
              this.airtableTableName
            }' not found in Base '${this.airtableService.getBaseId()}'`,
          );
        default:
          throw error;
      }
    }
  };

  findOneTodo = async (
    id: string,
    options?: TodoRequestOptions,
  ): Promise<Todo | Record<FieldSet>> => {
    try {
      const record = await this.airtableService.findRecordById(
        this.airtableTableName,
        id,
      );
      return options?.returnAirtableRecord
        ? record
        : this.todoEntityFromAirtableRecord(record);
    } catch (error) {
      switch (error.statusCode) {
        case 404:
          throw new NotFoundException(
            `${id} not found in ${
              this.airtableTableName
            } in ${this.airtableService.getBaseId()}`,
          );
        default:
          throw error;
      }
    }
  };

  updateTodo = async (
    id: string,
    updateTodoDto: UpdateTodoDto,
    options?: TodoRequestOptions,
  ): Promise<Todo | Record<FieldSet>> => {
    try {
      const record = await this.airtableService.findRecordByIdAndUpdate(
        this.airtableTableName,
        id,
        updateTodoDto,
      );
      return options?.returnAirtableRecord
        ? record
        : this.todoEntityFromAirtableRecord(record);
    } catch (error) {
      switch (error.statusCode) {
        case 404:
          throw new NotFoundException(
            `Todo '${id}' not found in Table '${
              this.airtableTableName
            }' in Base '${this.airtableService.getBaseId()}'`,
          );
        case 422:
          throw new HttpException(
            error.message,
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        default:
          throw error;
      }
    }
  };

  deleteTodo = async (id: string) => {
    try {
      await this.airtableService.findRecordByIdAndDelete(
        this.airtableTableName,
        id,
      );
    } catch (error) {
      switch (error.statusCode) {
        case 404:
          throw new NotFoundException(
            `Todo '${id}' not found in Table '${
              this.airtableTableName
            }' in Base '${this.airtableService.getBaseId()}'`,
          );
        default:
          throw error;
      }
    }
  };

  todoEntityFromAirtableRecord = (record: Record<FieldSet>): Todo => ({
    id: record.getId(),
    description: record.get("description") as string,
    isComplete: !!record.get("isComplete"),
  });
}
