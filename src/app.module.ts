import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { AirtableModule } from "./airtable/airtable.module";
import { TodosModule } from "./todos/todos.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TodosModule,
    AirtableModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          apiKey: configService.get<string>("AIRTABLE_API_KEY"),
          baseId: configService.get<string>("AIRTABLE_BASE_ID"),
        };
      },
    }),
    UsersModule,
  ],
})
export class AppModule {}
