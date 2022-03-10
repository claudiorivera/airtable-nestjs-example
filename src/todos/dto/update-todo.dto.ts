import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateTodoDto {
  @IsOptional()
  @IsBoolean()
  readonly isComplete?: boolean;

  @IsOptional()
  @IsString()
  readonly description?: string;
}
