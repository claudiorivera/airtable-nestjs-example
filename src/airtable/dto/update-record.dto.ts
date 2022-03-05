import { FindOneRecordDto } from "./find-one-record.dto";

export class UpdateRecordDto extends FindOneRecordDto {
  data: {
    [key: string]: any;
  };
}
