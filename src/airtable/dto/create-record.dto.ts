import { FindAllRecordsDto } from "./find-all-records.dto";

export class CreateRecordDto extends FindAllRecordsDto {
  data: {
    [key: string]: any;
  };
}
