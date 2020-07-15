const { Client } = require('pg');
var connectionString = "postgres://postgres:123@localhost:5433/ads_board";
const client = new Client({
    connectionString: connectionString
});
client.connect();

module.exports = {
    query: (text, params, callback) => {
      return client.query(text, params, callback)
    }
  }