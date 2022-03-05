import { IsString } from "class-validator";

import { FindAllRecordsDto } from "./find-all-records.dto";

export class FindOneRecordDto extends FindAllRecordsDto {
  @IsString()
  id: string;
}
