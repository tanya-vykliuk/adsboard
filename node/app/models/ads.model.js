/*const { Client } = require('pg');
var connectionString = "postgres://postgres:123@localhost:5433/ads_board";
const client = new Client({
    connectionString: connectionString
});
client.connect();*/
import client from '../server.js';

exports.findAll = (req, res) => {   
    const findAllQuery = 'SELECT * FROM advertisements';
    try {
        console.log('try');
        const { rows, rowCount } = client.query(findAllQuery);
        return res.status(200).send({ rows, rowCount });
    } catch(error) {
        console.log(error);
        return res.status(400).send(error);
    }      
};