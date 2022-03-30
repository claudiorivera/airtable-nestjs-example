import { DynamicModule, Module } from "@nestjs/common";

import { AirtableService } from "./airtable.service";
import { AirtableCoreModule } from "./airtable-core.module";
import { AirtableModuleAsyncOptions } from "./lib/interfaces";

@Module({
  providers: [AirtableService],
  exports: [AirtableService],
})
export class AirtableModule {
  public static forRootAsync = (
    options: AirtableModuleAsyncOptions,
  ): DynamicModule => ({
    module: AirtableModule,
    imports: [AirtableCoreModule.forRootAsync(options)],
  });
}
