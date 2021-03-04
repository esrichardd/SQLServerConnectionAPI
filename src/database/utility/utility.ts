import { columns } from "mssql"

const sendDbResponse = (err: any, rowCount: any, data: any, callback: any) => {
    if (err) {
        callback(err)
    } else {
        if (rowCount < 1) {
            callback(null, false)
        } else {
            callback(null, data, rowCount)
        }
    }
}

const buildRow = (columns: any, data: any) => {
    var row: any = {};
    columns.forEach((column: any) => {
        row[column.metadata.colName] = column.value
    });
    data.push(row)
}

export { sendDbResponse, buildRow }