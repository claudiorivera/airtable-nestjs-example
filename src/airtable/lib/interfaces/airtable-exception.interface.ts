import { HttpException, HttpStatus } from "@nestjs/common";
import AirtableError from "airtable/lib/airtable_error";

export class AirtableException extends HttpException {
  constructor(error: AirtableError) {
    super(
      `AirtableException: ${error.message}`,
      error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
