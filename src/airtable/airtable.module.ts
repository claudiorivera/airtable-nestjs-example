import { DynamicModule, Module } from "@nestjs/common";

import { AirtableService } from "./airtable.service";
import { AirtableCoreModule } from "./airtable-core.module";
import {
  AirtableModuleAsyncOptions,
  AirtableModuleOptions,
} from "./lib/interfaces/airtable-options.interface";

@Module({
  providers: [AirtableService],
  exports: [AirtableService],
})
export class AirtableModule {
  public static forRoot(options: AirtableModuleOptions): DynamicModule {
    return {
      module: AirtableModule,
      imports: [AirtableCoreModule.forRoot(options)],
    };
  }

  public static forRootAsync(
    options: AirtableModuleAsyncOptions,
  ): DynamicModule {
    return {
      module: AirtableModule,
      imports: [AirtableCoreModule.forRootAsync(options)],
    };
  }
}
