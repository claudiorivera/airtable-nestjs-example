import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from "@nestjs/common";

import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { TodosService } from "./todos.service";

@Controller("todos")
export class TodosController {
  constructor(private todosService: TodosService) {}

  @Post()
  async create(@Body() createTodoDto: CreateTodoDto) {
    return await this.todosService.create(createTodoDto);
  }

  @Get()
  async findAll() {
    return await this.todosService.findAll();
  }

  @Get("/:id")
  async findOne(@Param("id") id: string) {
    return await this.todosService.findOne(id);
  }

  @Put("/:id")
  async update(@Param("id") id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return await this.todosService.update(id, updateTodoDto);
  }

  @Delete("/:id")
  @HttpCode(204)
  async delete(@Param("id") id: string) {
    return await this.todosService.delete(id);
  }
}
