import { Module } from "@nestjs/common";
import { AirtableService } from "./airtable.service";

@Module({
  providers: [AirtableService],
})
export class AirtableModule {}
