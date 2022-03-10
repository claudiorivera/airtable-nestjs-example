import { HttpException, HttpStatus, Logger } from "@nestjs/common";
import AirtableError from "airtable/lib/airtable_error";

export class AirtableException extends HttpException {
  constructor(error: AirtableError) {
    Logger.error(JSON.stringify(error, null, 2), "AirtableException");
    super(
      `AirtableException: ${error.message}`,
      error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
