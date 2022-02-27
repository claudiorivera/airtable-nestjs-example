import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AirtableModule } from "./airtable/airtable.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    AirtableModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
