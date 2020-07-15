const client = require('../db');
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const config = require("../config/auth.config");
const jwt = require("jsonwebtoken");
const helper = require('../db/db_helper');

const getUsers = (request, response) => {
    client.query('SELECT u.*, ur.name as role_name FROM users as u JOIN user_roles as ur ON ur.id=u.role_id'+
    ' WHERE ur.name!=\'admin\'', (error, results) => {
        helper.handleError(error, response);
        if (results.rows)  return response.status(200).json(results.rows);                        
        return response.status(200).send({'message':'No Administrator users found'}); 
    });
}

function getUserRoles(){
    client.query('SELECT * FROM user_roles', (error, results) => {
        helper.handleError(error, response);
        return results.rows;
    });
}


const loginUser = (request, response) => {
    const {email, password} = request.body;
    validate_email = validateEmail(email);
    if(validateEmail.error === 1) return response.json({'errorEmail': validateEmail.message});

    validate_Password = validatePassword(password);
    if(validate_Password.err === 1) return response.json({'errorPassword': validate_Password.message});
    
    client.query('SELECT u.*, ur.name as role_name  FROM users as u Join user_roles as ur ON u.role_id=ur.id WHERE u.email = $1', [email], (error, results) => {
        helper.handleError(error, response);
        if(results.rows[0]){
            if( bcrypt.compare(password, results.rows[0].password)){
                user = results.rows[0];
                console.log(user)
                var token = jwt.sign({ id: user.id }, config.secret, {
                    expiresIn: 86400 // 24 hours
                });
                
                var authorities = [];
                authorities.push("ROLE_" + user.role_name.toUpperCase());   
                client.query('UPDATE users SET last_visit_date=NOW() WHERE id = $1', [user.id], 
                (error, results) => {
                    helper.handleError(error, response); 

                    response.status(200).send({
                        id: user.id,
                        username: user.name,
                        email: user.email,
                        roles: authorities,
                        accessToken: token
                    });   
                });                
            }else{
                response.status(500).send('Wrong email or password');    
            }
        }else{
            response.status(500).send('Provided email is not registered in system'); 
        }           
    }); 
}


const registerUser = (request, response) => {    
    const {password, email} = request.body;
    //validate inpued email from registration form
    validate_email = validateEmail(email);
    if(validateEmail.error == 1){
        return response.json({'errorEmail': validateEmail.message});
    }
    //check if exist user with inputed email
    let text = 'SELECT id FROM users WHERE email = $1';
    client.query(text, [email], (error, results) => {
        helper.handleError(error, response); 
        if(results.rows[0]){
            return response.status(500).send('User with this email already in use!')
        } 
        validate_Password = validatePassword(password);

        if(validate_Password.err === 1){
            return response.json({'errorPassword': validate_Password.message});
        }                  
        client.query('SELECT id FROM user_roles WHERE name = $1', ['user'], (error, results) => {
            helper.handleError(error, response);
            if (results.rows[0]) {
                roleId = results.rows[0].id;       
                const hash = newhashPassword(password);            
                let token = generateToken(Date.now()); 
                client.query('INSERT INTO users (email,  status, role_id, password, token) VALUES ($1, $2, $3, $4, $5) returning id',
                [`${request.body.email}`, 'new', roleId, `${hash}`, `${token}`], (error, results) => {
                    helper.handleError(error, response);
                    let sent = sendConfirmEmailToUser(request.body.email, token);
                    if(sent.error == 1){
                        return response.status(200).send({'message':'User successfully created','errorEmail':sent.message});
                    }
                    return response.status(200).send({'message':'User successfully created. To proceed using our website please check your email.  '+sent.message});     
                });  
            }      
        });  
    });
  }

  const  confirmRegistration = (request, response) => {
      let {token} = request.params;
     
        client.query('SELECT id FROM users WHERE token=$1 AND status=$2',
             [`${token}`, 'new'], (error, results) => {
        helper.handleError(error, response);
        if (results.rows[0]) {
            let id  = results.rows[0].id;
            client.query('UPDATE users SET token=\'\', status=\'active\' WHERE id = $1', [id], (error, results) => {
                helper.handleError(error, response);                
                return response.status(200).send({'message':'User successfully activated. Now you can Login using inputed credentials '});                      
            });
        }
        return response.status(500).
        send('Confirmation link is invalid. You already confirmed your account or link is broken.  If you can\'t confirm your account with this link,  try to get new one');
    });
}

    const getUserById = (request, response) => {        
        const {id} = request.params;
        if(!id) return response.status(500).send('User Id is lost.'); 

        client.query('SELECT u.*, ur.name as role_name FROM users as u JOIN user_roles as ur ON ur.id=u.role_id'+
        ' WHERE u.id = $1', [id], (error, results) => {
            helper.handleError(error, response);
            if (results.rows[0]) {
                return response.status(200).json(results.rows[0]);                        
            }else{
                return response.status(200).send({'errorUser':'User not found.Try to Login'});                          
            }
        });
    }

  function validateEmail(email) {
    res = {error:0, message:''};
    var re = new RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
    if (!re.test(email)) {
        res.error = 1;
        res.message = 'Provided email does not match proper email format';         
        return res; 
    }
    }
  
  function validatePassword(password) {
    res = {error:0, message:''};
    var re = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,100}$/);
    if (!re.test(password)) {
        res.error = 1;
        res.message = 'Provided password does not match proper password format (at least one Uppercase and one number)';               
    }
    return res;
  }

  function newhashPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash
  }

  function generateToken(param) {
    return  Math.random().toString(36).substr(2)+param;
  }

  function sendConfirmEmailToUser(email, token){
    res = {error:0, message:''};    
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "tanya.vykliuk@gmail.com",
            pass: "Dtyzysydem08"
        }
      });
      
      var mailOptions = {
        from: 'tanya.vykliuk@gmail.com',
        to: email,
        subject: 'Confirm registration',
        html: '<h1>Welcome to Advertisements Board!</h1>'
        +'<p>To confirm your registration please folow the link</p>'
        +'<a href=\"http://localhost:4200/confirmregistration/'+token+'\" style=\"cursor:pointer;\">Confirm registration</a>'
        +'<p>After confirmation you will be able to login and create your own advertisement messages to be closer to your future client</p>'
        +'<p>If you not registered in our site, just ignore this message</p>'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          res.error = 1;
          res.message = error;
        } else {
            res.message =info.response;         
        }
      });

      return res;
    }

  module.exports = {    
    registerUser,
    confirmRegistration,
    loginUser,
    getUserById,
    getUserRoles,
    getUsers
}