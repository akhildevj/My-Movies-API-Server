import { ERROR_CODES, FASTIFY_ERR_BODY_TOO_LARGE } from './../shared/constants';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { SbLogger } from '../shared/sb-logger/sb-logger.service';

interface ResError {
  statusCode?: number;
  message?: string;
}

interface LogError extends ResError {
  timestamp?: string;
  path?: string;
  host?: string;
  response?: ResError;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: SbLogger) {
    this.logger.setContext(HttpExceptionFilter.name);
  }

  getErrorCode(exception: any) {
    if (exception instanceof BadRequestException) return ERROR_CODES.INPUT;
    if (exception instanceof NotFoundException) return ERROR_CODES.NOT_FOUND;
    if (exception instanceof ForbiddenException) return ERROR_CODES.FORBIDDEN;
    if (exception instanceof UnauthorizedException)
      return ERROR_CODES.NO_PERMISSION;
    if (exception instanceof InternalServerErrorException)
      return ERROR_CODES.INTERNAL;
    if (exception.code === FASTIFY_ERR_BODY_TOO_LARGE)
      return ERROR_CODES.REQUEST_BODY_LARGE;
    return ERROR_CODES.DEFAULT;
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let resError: ResError;
    let msg: string;
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.FORBIDDEN;

    if (exception.response?.statusCode) {
      msg = exception.response.message;
      resError = exception.response;
    } else if (exception.response?.code) {
      msg = exception.response.message;
      resError = exception.response;
    } else if (exception.response?.data?.statusCode) {
      msg = exception.response.data.message;
      resError = exception.response.data;
    } else {
      msg =
        typeof exception.message === 'string'
          ? exception.message
          : exception.message.message;
      resError = this.getErrorCode(exception);
    }

    const logError: LogError = {
      statusCode: status,
      timestamp: new Date().toString(),
      path: request.url,
      message: msg || 'Something went wrong',
      host: request.headers.host,
      response: resError,
    };

    this.logger.log(
      `${request.method} ${request.url} ${status}
      ${JSON.stringify(logError)}`,
    );

    return response.code(status).send(resError);
  }
}
