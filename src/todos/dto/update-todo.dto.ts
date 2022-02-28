import { CreateTodoDto } from "./create-todo.dto";

export class UpdateTodoDto extends CreateTodoDto {
  readonly id: string;
  readonly isComplete: boolean;
}
