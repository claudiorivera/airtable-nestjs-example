import { Module } from "@nestjs/common";
import { AirtableModule } from "src/airtable/airtable.module";

import { TodosController } from "./todos.controller";
import { TodosService } from "./todos.service";

@Module({
  imports: [AirtableModule],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}
