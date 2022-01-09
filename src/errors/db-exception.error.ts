import { HttpException } from '@nestjs/common';
import { UtilsService } from '../utils/utils.service';
import { ERROR_CODES } from '../shared/constants';

export class DbExceptionError extends HttpException {
  constructor(props, context) {
    if (context.includes('duplicate key value violates unique constraint')) {
      props = {
        statusCode: ERROR_CODES.INPUT.statusCode,
        message: [
          `${UtilsService.convertSnakeCaseToCamelCase(
            props.detail.split(/[()]/, 2)[1],
          )} should be unique`,
        ],
      };
      context = 400;
    } else if (context.includes('violates foreign key constraint')) {
      props = {
        statusCode: ERROR_CODES.INPUT.statusCode,
        message: [
          `${UtilsService.convertSnakeCaseToCamelCase(
            props.detail.split(/[()]/, 2)[1],
          )} is invalid`,
        ],
      };
      context = 400;
    } else if (context.includes('violates check constraint')) {
      console.log(context);
      props = {
        statusCode: ERROR_CODES.INPUT.statusCode,
        message: [
          `${UtilsService.convertSnakeCaseToCamelCase(
            context.split(/"(.*?)"/g, 2)[1],
          )} should be a allowed value`,
        ],
      };
      context = 400;
    }
    super(props, context);
  }
}
