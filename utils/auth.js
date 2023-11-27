const jwt = require('jsonwebtoken');
const _ = require('lodash');
const RequestHandler = require('../utils/RequestHandler');
const Logger = require('../utils/logger');

const logger = new Logger();
const requestHandler = new RequestHandler(logger);

function getTokenFromHeader(req) {
	if ((req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token')
		|| (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')) {
		return req.headers.authorization.split(' ')[1];
	}

	return null;
}

function verifyToken(req, res, next) {
	try {
		if (_.isUndefined(req.headers.authorization)) {
			requestHandler.throwError(401, 'Unauthorized', 'Not Authorized to access this resource!')();
		}
		const Bearer = req.headers.authorization.split(' ')[0];

		if (!Bearer || Bearer !== 'Bearer') {
			requestHandler.throwError(401, 'Unauthorized', 'Not Authorized to access this resource!')();
		}

		const token = req.headers.authorization.split(' ')[1];

		if (!token) {
			requestHandler.throwError(401, 'Unauthorized', 'Not Authorized to access this resource!')();
		}

		jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
			if (err) {
				requestHandler.throwError(401, 'Unauthorized', 'Please provide a valid token, your token might be expired')();
			}
			req.decoded = decoded;
			next();
		});
	} catch (err) {
		requestHandler.sendError(req, res, err);
	}
}


function getSomeFromToken(req, options) {
	try {
		var token = getTokenFromHeader(req);
		if(!token){
			token = req.query.token
		}
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		return _.pick(decoded, options);
	} catch (err) {
		return null;
	}
}


module.exports = { getJwtToken: getTokenFromHeader, isAuthenticated: verifyToken, getSomeFromToken };
