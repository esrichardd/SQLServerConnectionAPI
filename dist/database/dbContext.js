"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connect_1 = require("./connect");
const utility_1 = require("./utility/utility");
const Request = require('tedious').Request;
const spGetExecute = (query, callback) => {
    let data = [];
    let dataset = [];
    let resultset = 0;
    var request = new Request(query, function (err, rowCount) {
        utility_1.sendDbResponse(err, rowCount, dataset, callback);
    });
    request.on('row', function (columns) {
        utility_1.buildRow(columns, data);
    });
    request.on('doneInProc', function (rowCount, more, rows) {
        dataset.push(data);
        data = [];
    });
    connect_1.connection.execSql(request);
};
const queryGetExecute = (query, params, isMultiSet, callback) => {
    let data = [];
    let dataset = [];
    let resultset = 0;
    var request = new Request(query, function (err, rowCount) {
        utility_1.sendDbResponse(err, rowCount, dataset, callback);
    });
    params.forEach((param) => {
        let t = parseInt(param.val);
        request.addParameter(param.name, param.type, param.val);
    });
    request.on('row', function (columns) {
        utility_1.buildRow(columns, data);
    });
    request.on('doneInProc', function (rowCount, more, rows) {
        if (isMultiSet == false) {
            dataset = data;
            // dataset.push(data);
            // data = [];
        }
        else {
            dataset.push(data);
            data = [];
        }
    });
    connect_1.connection.execSql(request);
};
const spPostExecute = (query, params, callback) => {
    let newdata = [];
    var request = new Request(query, function (err, rowCount) {
        utility_1.sendDbResponse(err, rowCount, newdata, callback);
    });
    params.forEach((param) => {
        request.addParameter(param.name, param.type, param.val);
    });
    request.on('row', function (columns) {
        utility_1.buildRow(columns, newdata);
    });
    connect_1.connection.execSql(request);
};
exports.default = { get: spGetExecute, getQuery: queryGetExecute, post: spPostExecute };
//# sourceMappingURL=dbContext.js.map