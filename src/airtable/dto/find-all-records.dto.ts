import { IsString } from "class-validator";

export class FindAllRecordsDto {
  @IsString()
  tableName: string;
}
