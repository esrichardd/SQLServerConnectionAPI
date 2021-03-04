"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const configDotenv = {
    path: path_1.default.join(__dirname, '../.env')
};
dotenv_1.default.config(configDotenv);
const Connection = require('tedious').Connection;
const config = {
    server: process.env.SBQ_HOST,
    authentication: {
        type: 'default',
        options: {
            userName: process.env.USER_SQL,
            password: process.env.PASSWORD_SQL //update me
        }
    },
    options: {
        // If you are on Microsoft Azure, you need encryption:
        encrypt: false,
        database: process.env.SECOND_DATABASE,
        rowCollectionOnRequestCompletion: true
    }
};
exports.connection = new Connection(config);
exports.connection.connect();
exports.connection.on('connect', function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log('Connected');
    }
});
//# sourceMappingURL=connect.js.map