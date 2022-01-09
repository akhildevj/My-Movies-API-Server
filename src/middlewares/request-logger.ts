import * as morgan from 'morgan';
import { SbLogger } from '../shared/sb-logger/sb-logger.service';

export function useRequestLogging(app) {
  const logger = new SbLogger('Http');
  app.use(
    morgan(
      ':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"    ',
      {
        skip: (req) => {
          return (
            process.env.NODE_ENV === 'production' || req.url === '/status.html'
          );
        },
        stream: {
          write: (message) => logger.log(message.replace('\n', '')),
        },
      },
    ),
  );
}
