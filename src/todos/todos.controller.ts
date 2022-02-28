import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";

import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { TodosService } from "./todos.service";

@Controller("todos")
export class TodosController {
  constructor(private todosService: TodosService) {}

  @Get()
  async findAll() {
    return await this.todosService.findAll();
  }

  @Get(":id")
  async findOne(@Param() { id }) {
    return await this.todosService.findOne({ id });
  }

  @Post()
  async create(@Body() { name }: CreateTodoDto) {
    return await this.todosService.create({ name });
  }

  @Put(":id")
  async update(@Param() { id }, @Body() { name, isComplete }: UpdateTodoDto) {
    return await this.todosService.update({ id, name, isComplete });
  }
}
