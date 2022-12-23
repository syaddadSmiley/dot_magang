const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const async = require('async');
const jwt = require('jsonwebtoken');

const RequestHandler = require('../utils/RequestHandler');
const Logger = require('../utils/logger');
const BaseController = require('../controllers/BaseController');

class WorkspaceController extends BaseController {
    static async getAllWorkingspaces(req, res){
        res.send('ok');
    }
}

module.exports = WorkspaceController;