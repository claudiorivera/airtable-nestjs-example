import { Controller, Get } from "@nestjs/common";

import { TodosService } from "./todos.service";

@Controller("todos")
export class TodosController {
  constructor(private todosService: TodosService) {}

  @Get()
  async findAll() {
    return await this.todosService.findAll();
  }
}
