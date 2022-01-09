export const MAX_JSON_REQUEST_SIZE = 10485760;

export const FASTIFY_ERR_BODY_TOO_LARGE = 'FST_ERR_CTP_BODY_TOO_LARGE';

export const ERROR_CODES = {
  DEFAULT: {
    statusCode: 1000,
    message: 'Internal error',
  },
  INTERNAL: {
    statusCode: 1001,
    message: 'Internal error',
  },
  INPUT: {
    statusCode: 1002,
    message: 'Invalid input format',
  },
  AUTH_ERROR: {
    statusCode: 1003,
    message: 'Authentication error',
  },
  NOT_FOUND: {
    statusCode: 1004,
    message: 'Resource not found',
  },
  STORE_ACCOUNT_LOGIN: {
    statusCode: 1005,
    message: 'Store account not allowed',
  },
  NO_PERMISSION: {
    statusCode: 1006,
    message: "Sorry, you don't have permission to perform this operation!",
  },
  INACTIVE_ACCOUNT: {
    statusCode: 1007,
    message: 'Inactive account',
  },
  ACCESS_TOKEN_INVALID: {
    statusCode: 1008,
    message: 'Invalid access token',
  },
  REFRESH_TOKEN_INVALID: {
    statusCode: 1009,
    message: 'Invalid refresh token',
  },
  REQUEST_BODY_LARGE: {
    statusCode: 1010,
    message: 'Request body too large',
  },
  FORBIDDEN: {
    statusCode: 1011,
    message: 'This request cannot be fulfilled',
  },
  CLIENT_SYSTEM_ID_HEADER: {
    message: 'Unauthorized access',
  },
  WEB: {
    code: '-1',
  },
};
