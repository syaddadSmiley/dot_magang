const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const uuid = require('uuid');

//SECURITY
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const csurf = require('csurf');
const rateLimit = require('express-rate-limit');
///

const Logger = require('./utils/logger.js');

const logger = new Logger();
const app = express();
const config = dotenv.config().parsed;
//add config to process.env
if(!config) {
	process.env.PORT = 8080;
	process.env.JWT_SECRET = 'jwt_secret';
	process.env.JWT_EXPIRATION = '1h';
	process.env.DB_HOST = 'localhost';
	process.env.DB_PORT = 3306;
	process.env.DB_NAME = 'db_magang';
	process.env.DB_USER = 'db_magang';
	process.env.DB_PASS = 'db_magang';
	process.env.NODE_ENV = 'test';
}else{
	Object.keys(config).forEach((key) => {
		process.env[key] = config[key];
	});
}


app.use(bodyParser.json());
app.use(require('method-override')());

app.use(compression());
app.use(cors());

process.on('SIGINT', () => {
	logger.log('stopping the server', 'info');
	process.exit();
});

app.set('db', require('./models/index.js'));

app.set('port', process.env.DEV_APP_PORT);
if(process.env.NODE_ENV !== 'test') {
	app.use((req, res, next) => {
		req.identifier = uuid();
		const logString = `a request has been made with the following uuid [${req.identifier}] | ${req.ip} | ${req.url} | ${req.headers['user-agent']} ${JSON.stringify(req.body)}`;
		logger.log(logString, 'info');
		next();
	});
}

app.use(require('./router'));
app.get('/', (req, res) => {
	res.status(200).type('text/plain').send('hello world');
});

app.use((req, res, next) => {
	logger.log('the url you are trying to reach is not hosted on our server T_T', 'error');
	const err = new Error('Not Found');
	err.status = 404;
	res.status(err.status).json({ type: 'error', message: 'the url you are trying to reach is not hosted on our server T_T' });

	req.identifier = uuid();
	const logString = `a request has been made with the following uuid [${req.identifier}] | ${req.ip} | ${req.url} | ${req.headers['user-agent']} ${JSON.stringify(req.body)}`;
	logger.log(logString, 'info');
	next(err);
});

app.use(csurf({ cookie: true }));
app.use((err, req, res, next) => {
	if (err.code !== 'EBADCSRFTOKEN') return next(err);
	logger.log('the csrf token is invalid', 'error');
	res.status(403).json({ type: 'error', message: 'the csrf token is invalid' });
});

app.use(helmet());
app.use(rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	message: 'Too many requests from this IP, please try again after an hour',
}));

/**
 * Create HTTP server.
 */
const server = http.createServer(app)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
	const port = parseInt(val, 10);

	if (Number.isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}
/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	const bind = typeof port === 'string'
		? `Pipe ${port}`
		: `Port ${port}`;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			logger.log(`${bind} requires elevated privileges`);
			process.exit(1);
			break;
		case 'EADDRINUSE':
			logger.log(`${bind} is already in use`);
			process.exit(1);
			break;
		default:
			throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
	const addr = server.address();
	const bind = typeof addr === 'string'
		? `pipe ${addr}`
		: `port ${addr.port}`;

	logger.log(`the server started listining on port ${bind}`, 'info');
}

server.listen(port)
server.on('error', onError);
server.on('listening', onListening);

module.exports = app;
