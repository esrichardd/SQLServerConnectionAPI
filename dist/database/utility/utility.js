"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildRow = exports.sendDbResponse = void 0;
const sendDbResponse = (err, rowCount, data, callback) => {
    if (err) {
        callback(err);
    }
    else {
        if (rowCount < 1) {
            callback(null, false);
        }
        else {
            callback(null, data, rowCount);
        }
    }
};
exports.sendDbResponse = sendDbResponse;
const buildRow = (columns, data) => {
    var row = {};
    columns.forEach((column) => {
        row[column.metadata.colName] = column.value;
    });
    data.push(row);
};
exports.buildRow = buildRow;
//# sourceMappingURL=utility.js.map