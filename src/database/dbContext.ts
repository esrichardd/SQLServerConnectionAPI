import { connection } from './connect';
import { sendDbResponse, buildRow } from './utility/utility';
const Request = require('tedious').Request;
// var TYPES = require('tedious').TYPES;
import { TYPES } from 'tedious'

const spGetExecute = (query: any, callback: any) => {

    let data: any[] = [];
    let dataset: any[] = [];
    let resultset = 0;

    var request = new Request(query, function (err: any, rowCount: any) {
        sendDbResponse(err, rowCount, dataset, callback);
    })

    request.on('row', function (columns: any) {
        buildRow(columns, data);
    })

    request.on('doneInProc', function (rowCount: any, more: any, rows: any) {
        dataset.push(data);
        data = [];
    })

    connection.execSql(request);
}

const queryGetExecute = (query: any, params: any, isMultiSet: any, callback: any) => {
    let data: any[] = [];
    let dataset: any[] = [];
    let resultset = 0;

    var request = new Request(query, function (err: any, rowCount: any) {
        sendDbResponse(err, rowCount, dataset, callback)
    });

    params.forEach((param: any) => {
        let t = parseInt(param.val)
        request.addParameter(param.name, param.type, param.val);
    });

    request.on('row', function (columns: any) {
        buildRow(columns, data);
    });


    request.on('doneInProc', function (rowCount: any, more: any, rows: any) {
        if (isMultiSet == false) {
            dataset = data;
            // dataset.push(data);
            // data = [];
        } else {
            dataset.push(data);
            data = [];
        }
    })
    connection.execSql(request);
}

const spPostExecute = (query: any, params: any, callback: any) => {
    let newdata: any[] = [];
    var request = new Request(query, function (err: any, rowCount: any) {
        sendDbResponse(err, rowCount, newdata, callback);
    });

    params.forEach((param: any) => {
        request.addParameter(param.name, param.type, param.val)
    });

    request.on('row', function (columns: any) {
        buildRow(columns, newdata);
    });
    connection.execSql(request);
}

export default { get: spGetExecute, getQuery: queryGetExecute, post: spPostExecute }