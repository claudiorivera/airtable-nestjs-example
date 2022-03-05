import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { AirtableService } from "src/airtable/airtable.service";

import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { Todo } from "./interfaces/todo.interface";

@Injectable()
export class TodosService {
  airtableTableName: string;
  constructor(private airtableService: AirtableService) {
    this.airtableTableName = "todos";
  }

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    try {
      const record = await this.airtableService.create({
        tableName: this.airtableTableName,
        data: createTodoDto,
      });
      return {
        id: record.getId(),
        description: record.get("description") as string,
        isComplete: !!record.get("isComplete"),
      };
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

  async findAll(): Promise<Todo[]> {
    try {
      const records = await this.airtableService.findAll({
        tableName: this.airtableTableName,
      });
      const todos = records.map((record) => {
        return {
          id: record.getId(),
          description: record.get("description") as string,
          isComplete: !!record.get("isComplete"),
        };
      });
      return todos;
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

  async findOne(id: string): Promise<Todo> {
    try {
      const record = await this.airtableService.findOne({
        tableName: this.airtableTableName,
        id,
      });
      return {
        id: record.getId(),
        description: record.get("description") as string,
        isComplete: !!record.get("isComplete"),
      };
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

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    try {
      const record = await this.airtableService.update({
        tableName: this.airtableTableName,
        id,
        data: updateTodoDto,
      });
      return {
        id: record.getId(),
        description: record.get("description") as string,
        isComplete: !!record.get("isComplete"),
      };
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

  async delete(id: string) {
    try {
      await this.airtableService.delete({
        tableName: this.airtableTableName,
        id,
      });
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
}
