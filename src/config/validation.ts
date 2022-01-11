import * as Joi from 'joi';

export default Joi.object({
  LOCALHOST: Joi.string().required(),
  NODE_ENV: Joi.string()
    .valid('development', 'staging', 'production')
    .default('development'),
  PORT: Joi.number().default(3000),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_NAME: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  SWAGGER_SERVER: Joi.boolean().required(),
  ELASTIC_HOST: Joi.string().required(),
  ELASTIC_USERNAME: Joi.string().required(),
  ELASTIC_PASSWORD: Joi.string().required(),
  MOVIE_INDEX: Joi.string().required(),
});
