import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import cookieParser from 'cookie-parser';
import apiRouter from './routes/apiRouter.mjs';
import expresWinston from 'express-winston';
import {cusLogger, requestLogger} from './cusLogger.mjs';
// const __dirname = path.resolve();
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));


var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// apply winston logger for requestLogTransports
// app.use(expresWinston.logger({
//     winstonInstance: requestLogger,
//     statusLevels: true
// }))

expresWinston.requestWhitelist.push('config')
expresWinston.responseWhitelist.push('config')
expresWinston.requestWhitelist.push('api')
expresWinston.responseWhitelist.push('api')

// define urls
app.use(`/`, express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, 'public', 'static')))
app.use('/media', express.static(path.join(__dirname, 'public', 'media')))
app.use('/config', express.static(path.join(__dirname, 'public')));
app.use('/api', apiRouter);

app.use(expresWinston.errorLogger({
    winstonInstance: cusLogger  
}))

export default app;