import dotenv from 'dotenv';
import path from 'path';

const configDotenv = {
    path: path.join(__dirname, '../.env')
}
dotenv.config(configDotenv);

const Connection = require('tedious').Connection;
const config = {
    server: process.env.SBQ_HOST,  //update me
    authentication: {
        type: 'default',
        options: {
            userName: process.env.USER_SQL, //update me
            password: process.env.PASSWORD_SQL  //update me
        }
    },
    options: {
        // If you are on Microsoft Azure, you need encryption:
        encrypt: false,
        database: process.env.SECOND_DATABASE,  //update me
        rowCollectionOnRequestCompletion: true
    }
};

export const connection = new Connection(config);
connection.connect();
connection.on('connect', function (err: any) {
    if (err) {
        console.log(err)
    } else {
        console.log('Connected')
    }
})