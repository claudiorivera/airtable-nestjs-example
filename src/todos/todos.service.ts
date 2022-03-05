import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
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
      Logger.error(error, "TodosService.create");
      if (error.statusCode === 422) {
        throw new HttpException(
          `Invalid fields: ${JSON.stringify(createTodoDto, null, 2)}`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
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
      if (error.statusCode === 404) {
        throw new NotFoundException(
          `Table ID '${
            this.airtableTableName
          }' not found in Base ID '${this.airtableService.getBaseId()}'`,
        );
      } else {
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
      if (error.statusCode === 404) {
        throw new NotFoundException(
          `Todo ID '${id}' not found in Table named '${
            this.airtableTableName
          }' in Base ID '${this.airtableService.getBaseId()}'`,
        );
      } else {
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
      Logger.error(error, "TodosService.update");
      if (error.statusCode === 422) {
        throw new HttpException(
          `Invalid fields: ${JSON.stringify(updateTodoDto, null, 2)}`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      if (error.statusCode === 404) {
        throw new NotFoundException(
          `Todo ID '${id}' not found in Table named '${
            this.airtableTableName
          }' in Base ID '${this.airtableService.getBaseId()}'`,
        );
      } else {
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
      if (error.statusCode === 404) {
        throw new NotFoundException(
          `Todo ID '${id}' not found in Table named '${
            this.airtableTableName
          }' in Base ID '${this.airtableService.getBaseId()}'`,
        );
      } else {
        throw error;
      }
    }
  }
}
