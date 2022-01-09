import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { description, name, version } from '../package.json';
import { AppModule } from './app.module';
import { useRequestLogging } from './middlewares/request-logger';
import { MAX_JSON_REQUEST_SIZE } from './shared/constants';
import { SbLogger } from './shared/sb-logger/sb-logger.service';
import { UtilsService } from './utils/utils.service';

async function bootstrap() {
  const logger = new SbLogger('main');
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ bodyLimit: MAX_JSON_REQUEST_SIZE }),
  );
  app.useLogger(logger);
  useRequestLogging(app);
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const config = app.get<ConfigService>(ConfigService);
  const port = config.get('config.port');
  const env = config.get('config.environment');

  if (process.env.NODE_ENV !== 'production') {
    app.enableCors({
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });
  }

  // Swagger Configuration
  if (process.env.SWAGGER_SERVER === 'true') {
    const options = new DocumentBuilder()
      .setTitle(
        UtilsService.convertStringToSentenceCase(name.replace(/-/gi, ' ')),
      )
      .setDescription(`${description}\nRunning on ${process.env.NODE_ENV} Mode`)
      .setVersion(version)
      .addServer(
        `http://${process.env.LOCALHOST}:${process.env.PORT}`,
        'Local Dev Server',
      )
      .addServer(process.env.DEV_SERVER_URL, 'Remote Dev Server')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api-docs', app, document);
  }

  await app.listen(port, '0.0.0.0');
  logger.log(`Listening on port ${port}, running in ${env} environment`);
}

bootstrap();
