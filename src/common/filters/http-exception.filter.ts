import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import mongoose from 'mongoose';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = 500;
    let errors: Record<string, string> = {};

    if (exception instanceof BadRequestException) {
      statusCode = exception.getStatus();
      const res: any = exception.getResponse();

      if (typeof res === 'object' && !Array.isArray(res)) {
        errors = res;
      } else if (Array.isArray(res.message)) {
        res.message.forEach((msg: string) => {
          const [field, errorMsg] = msg.split(':').map((s) => s.trim());
          errors[field] = errorMsg ?? msg;
        });
      } else {
        errors = { message: res.message || 'Bad Request' };
      }
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res: any = exception.getResponse();
      errors = {
        message:
          (typeof res === 'string' ? res : res.message) || 'Http Exception',
      };
    }

    // 3. Mongoose Duplicate Key Hatası
    else if (
      exception instanceof mongoose.mongo.MongoServerError &&
      exception.code === 11000
    ) {
      statusCode = 400;
      const field = Object.keys(exception.keyValue)[0];
      errors[field] = `${field} already exists`;
    } else if (exception instanceof mongoose.Error.ValidationError) {
      statusCode = 400;
      for (const field in exception.errors) {
        errors[field] = exception.errors[field].message;
      }
    } else if (exception instanceof mongoose.Error.CastError) {
      statusCode = 400;
      errors[exception.path] = `Invalid value for ${exception.path}`;
    } else {
      errors = { message: 'Internal server error' };
    }

    response.status(statusCode).json({
      success: false,
      statusCode,
      errors,
    });
  }
}
