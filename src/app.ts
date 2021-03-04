import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import logging from './config/logging';
import config from './config/config';
import Routes from './routes/routes';

const NAMESPACE = 'Server';
const router = express();

router.use((req, res, next) => {
    logging.info(NAMESPACE, `METHOD ~ [${req.method}] URL ~ [${req.url}], IP ~ [${req.socket.remoteAddress}]`);
    res.on('finish', () => {
        logging.info(NAMESPACE, `METHOD ~ [${req.method}] URL ~ [${req.url}], IP ~ [${req.socket.remoteAddress}], status ~ [${res.statusCode}]`);
    });
    next();
})

/** Parse the request */
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allos-Methods', '*');
        return res.status(200).json({});
    }
    next();
});

/** Routes */
router.use('/api/v1/', Routes);

/** Error Handling */
router.use((req, res, next) => {
    const error = new Error('not found');
    return res.status(404).json({
        message: error.message
    });
});

/** Create the server */
const httpServer = http.createServer(router);
httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `Server running on ${config.server.hostname}:${config.server.port}`));