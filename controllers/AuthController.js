const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const RequestHandler = require('../utils/RequestHandler');
const Logger = require('../utils/logger');
const BaseController = require('../controllers/BaseController');

const logger = new Logger();
const requestHandler = new RequestHandler(logger);

class AuthController extends BaseController {
	static async login(req, res) {
		try {
			const schema = {
				username: Joi.string().required().max(255),
				password: Joi.string().required().max(255),
				userAgent: Joi.string().required().max(255),
			};
			const { error } = Joi.validate({ username: req.body.username, password: req.body.password, userAgent: req.headers['user-agent'] }, schema);
			requestHandler.validateJoi(error, 400, "bad request", error ? error.details[0].message : '');

			const data = {
				username: req.body.username,
				password: req.body.password,
				userAgent: req.headers['user-agent'],
			};

			if (!(String(data.userAgent).includes("Mozilla") ||  String(data.userAgent).includes("Chrome") || String(data.userAgent).includes("PostmanRuntime"))) {
				requestHandler.throwError(400, "bad request", 'please provide a valid header')();			
			}

			const options = {
				where: { username: data.username },
			};
			const user = await super.getByCustomOptions(req, 'users', options);
			if (user.length === 0) {
				requestHandler.throwError(400, "bad request", 'invalid')();
			} else {
				const isPasswordValid = await bcrypt.compare(data.password, user[0].dataValues.password)
				if (!isPasswordValid) {
					requestHandler.throwError(400, "bad request", 'invalid')();
				}
			}

			const payload = {
				id: user[0].dataValues.id,
				username: user[0].dataValues.username,
				userAgent: data.userAgent,
			};
			// console.log(process.env.JWT_SECRET, process.env.JWT_EXPIRE)
			const token = jwt.sign({ payload }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE, algorithm: 'HS512' });
			requestHandler.sendSuccess(res, 'Logged in')({ token });
		} catch (error) {
			requestHandler.sendError(req, res, error);
		}
	}
}
module.exports = AuthController;
