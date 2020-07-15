const { Client } = require('pg');
var connectionString = "postgres://postgres:123@localhost:5433/ads_board";
//const bcrypt = require('bcrypt');
const client = new Client({
    connectionString: connectionString
});
client.connect();


const getUserbyEmail = (request, response) => {

    const client = new Client({
        connectionString: connectionString
    });
    client.connect();
    console.log('usermodel getUserbyEmail');

    let text = 'SELECT u.*, ur.name as role_name FROM users as u LEFT JOIN user_roles as ur ON ur.id=u.role_id WHERE u.email = $1';
    //console.log(request);
    client.query(text, [request], (error, results) => {
        if (error) {
            throw error
        }
        client.end();
        return results.rows[0];   
        
    })
}




const createUser = (request, response) => {
    console.log('usermodel registerUser request.role = ', request.roleId);
    console.log(request);
    client.query('INSERT INTO users (email, registration_date, status, role_id, password) VALUES ($1, $2, $3, $4, $5) returning id',
    [request.email, 'NOW()', 'new', request.roleid, request.hash], (error, results) => {
      if (error) { console.log('error');
        throw error
      }
      console.log('success');      
      //return ${results.insertId};
      response.status(200).send({'message':'User added with ID: ${results.insertId}'});
    })
  }



    const getUserRoleByName = (request) => {
        console.log('usermodel getUserRoleByName');
        client.query('SELECT id FROM user_roles WHERE name = $1', [request], (error, results) => {
            if (error) {
                throw error
            }
            if (results.rows[0]) {
                console.log('in function roleId = ',results.rows[0].id );   
                return results.rows[0].id;       
                //return roleId = results.rows[0].id;
            }
            //return 0;
        });
    }

  module.exports = {    
    createUser,
    getUserbyEmail,
    getUserRoleByName
}