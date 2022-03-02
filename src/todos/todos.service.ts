import { Injectable } from "@nestjs/common";
import { AirtableService } from "src/airtable/airtable.service";

import { Todo } from "./interfaces/todo.interface";

@Injectable()
export class TodosService {
  constructor(private airtableService: AirtableService) {}

  async findAll(): Promise<Todo[]> {
    const rows = await this.airtableService.findAll({ tableName: "Todos" });
    const todos = rows.map((row) => {
      return {
        id: row.id,
        name: row.get("name") as string,
        isComplete: !!row.get("isComplete"),
      };
    });
    return todos;
  }
}
