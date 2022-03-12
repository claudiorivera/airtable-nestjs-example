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
  airtableTableName: string;
  constructor(private airtableService: AirtableService) {
    this.airtableTableName = "todos";
  }

  async createTodo(
    createTodoDto: CreateTodoDto,
    options?: TodoRequestOptions,
  ): Promise<Todo | Record<FieldSet>> {
    try {
      const record = await this.airtableService.createRecord(
        this.airtableTableName,
        createTodoDto,
      );
      return options?.rawRecordData
        ? record
        : this.pojoFromAirtableRecord(record);
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
  }

  async findAllTodos(
    options?: TodoRequestOptions,
  ): Promise<Todo[] | Records<FieldSet>> {
    try {
      const records = await this.airtableService.findAllRecords(
        this.airtableTableName,
      );
      if (options?.rawRecordData) {
        return records;
      } else {
        const todos = records.map((record) => {
          return this.pojoFromAirtableRecord(record);
        });
        return todos;
      }
    } catch (error) {
      switch (error.statusCode) {
        case 404:
          throw new NotFoundException(
            `Table ID '${
              this.airtableTableName
            }' not found in Base ID '${this.airtableService.getBaseId()}'`,
          );
        default:
          throw error;
      }
    }
  }

  async findOneTodo(
    id: string,
    options?: TodoRequestOptions,
  ): Promise<Todo | Record<FieldSet>> {
    try {
      const record = await this.airtableService.findRecordById(
        this.airtableTableName,
        id,
      );
      return options?.rawRecordData
        ? record
        : this.pojoFromAirtableRecord(record);
    } catch (error) {
      switch (error.statusCode) {
        case 404:
          throw new NotFoundException(
            `Todo ID '${id}' not found in Table named '${
              this.airtableTableName
            }' in Base ID '${this.airtableService.getBaseId()}'`,
          );
        default:
          throw error;
      }
    }
  }

  async updateTodo(
    id: string,
    updateTodoDto: UpdateTodoDto,
    options?: TodoRequestOptions,
  ): Promise<Todo | Record<FieldSet>> {
    try {
      const record = await this.airtableService.findRecordByIdAndUpdate(
        this.airtableTableName,
        id,
        updateTodoDto,
      );
      return options?.rawRecordData
        ? record
        : this.pojoFromAirtableRecord(record);
    } catch (error) {
      switch (error.statusCode) {
        case 404:
          throw new NotFoundException(
            `Todo ID '${id}' not found in Table named '${
              this.airtableTableName
            }' in Base ID '${this.airtableService.getBaseId()}'`,
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
  }

  async deleteTodo(id: string) {
    try {
      await this.airtableService.findRecordByIdAndDelete(
        this.airtableTableName,
        id,
      );
    } catch (error) {
      switch (error.statusCode) {
        case 404:
          throw new NotFoundException(
            `Todo ID '${id}' not found in Table named '${
              this.airtableTableName
            }' in Base ID '${this.airtableService.getBaseId()}'`,
          );
        default:
          throw error;
      }
    }
  }

  pojoFromAirtableRecord = (record: Record<FieldSet>): Todo => {
    const assignedToExists =
      Array.isArray(record.get("assignedToUserRecord")) &&
      (record.get("assignedToUserRecord") as string[]).length;
    const assignedTo = assignedToExists
      ? {
          id: (record.get("assignedToUserRecord") as string[])[0],
          name: (record.get("assignedToUserNameLookup") as string[])[0],
        }
      : null;

    return {
      id: record.getId(),
      description: record.get("description") as string,
      isComplete: !!record.get("isComplete"),
      assignedTo,
    };
  };
}
