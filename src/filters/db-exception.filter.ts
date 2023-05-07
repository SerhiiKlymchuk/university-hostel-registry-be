import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { Error } from 'mongoose';

@Catch(Error.ValidationError)
export class DbExceptionFilter implements ExceptionFilter {
  catch(exception: Error.ValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(422).json({
      statusCode: 422,
      error: 'Validation Error',
      message: extractErrorMessages(exception),
    });
  }
}

function extractErrorMessages(exception: Error.ValidationError): Array<string> {
  const errors = [];
  if (exception && exception.errors) {
    for (const key in exception.errors) {
      errors.push(`'${key}' is already in use!`);
    }
  }
  return errors;
}
