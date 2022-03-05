import { Test } from "@nestjs/testing";

import { AirtableModule } from "./airtable.module";
import { AIRTABLE_CONFIG_TOKEN } from "./lib/common/airtable.constants";
import {
  AirtableModuleOptions,
  AirtableOptionsFactory,
} from "./lib/interfaces/airtable-options.interface";

describe("AirtableModule", () => {
  const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = process.env;

  const config: AirtableModuleOptions = {
    apiKey: AIRTABLE_API_KEY,
    baseId: AIRTABLE_BASE_ID,
  };

  class TestService implements AirtableOptionsFactory {
    createAirtableOptions(): AirtableModuleOptions {
      return config;
    }
  }

  describe("forRoot", () => {
    it("should provide the sentry client", async () => {
      const module = await Test.createTestingModule({
        imports: [AirtableModule.forRoot(config)],
      }).compile();

      const sentry = module.get<AirtableModuleOptions>(AIRTABLE_CONFIG_TOKEN);

      expect(sentry).toBeDefined();
    });
  });

  describe("forRootAsync", () => {
    describe("when `useFactory` op is used", () => {
      it("should provide sentry client", async () => {
        const module = await Test.createTestingModule({
          imports: [
            AirtableModule.forRootAsync({
              useFactory: () => config,
            }),
          ],
        }).compile();

        const sentry = module.get<AirtableModuleOptions>(AIRTABLE_CONFIG_TOKEN);

        expect(sentry).toBeDefined();
      });
    });
  });

  describe("when `useClass` option is used", () => {
    it("should provide sentry client", async () => {
      const module = await Test.createTestingModule({
        imports: [
          AirtableModule.forRootAsync({
            useClass: TestService,
          }),
        ],
      }).compile();

      const sentry = module.get<AirtableModuleOptions>(AIRTABLE_CONFIG_TOKEN);

      expect(sentry).toBeDefined();
    });
  });
});
