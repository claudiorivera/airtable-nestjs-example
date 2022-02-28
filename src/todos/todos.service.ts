import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Airtable from "airtable";
import { AirtableBase } from "airtable/lib/airtable_base";

import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { Todo } from "./interfaces/todo.interface";

@Injectable()
export class TodosService {
  private airtableBase: AirtableBase;
  constructor(private configService: ConfigService) {
    this.airtableBase = Airtable.base(
      this.configService.get<string>("AIRTABLE_BASE_ID"),
    );
  }

  async findAll(): Promise<Todo[]> {
    const query = this.airtableBase("Todos").select();
    const rows = await query.all();
    const todos = rows.map((row) => ({
      id: row.id,
      name: row.get("name") as string,
      isComplete: !!row.get("isComplete"),
    }));
    return todos;
  }

  async findOne({ id }: { id: string }): Promise<Todo> {
    const row = await this.airtableBase("Todos").find(id);
    return {
      id: row.id,
      name: row.get("name") as string,
      isComplete: !!row.get("isComplete"),
    };
  }

  async create({ name }: CreateTodoDto): Promise<Todo> {
    const row = await this.airtableBase("Todos").create({
      name,
    });

    return {
      id: row.id,
      name: row.get("name") as string,
      isComplete: !!row.get("isComplete"),
    };
  }

  async update({ id, name, isComplete }: UpdateTodoDto): Promise<Todo> {
    const row = await this.airtableBase("Todos").update(id, {
      name,
      isComplete,
    });

    return {
      id: row.id,
      name: row.get("name") as string,
      isComplete: !!row.get("isComplete"),
    };
  }
}
