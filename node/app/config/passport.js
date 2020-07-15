const passport = require ('passport');
const config = require("../config/auth.config.js");
const client = require('../db');

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secret;


passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
  client.query('SELECT u.*, ur.name as role_name  FROM users as u Join user_roles as ur ON u.role_id=ur.id WHERE u.id = $1',
   [jwt_payload.id], (error, results) => {

    console.log(jwt_payload)
    if (error) {
      return done(err, false);
    } 
    if(results.rows[0]){
      return done(null, results.rows[0]);
    }else{
      return done(null, false);
    }   
});

}));


/*
passport.use(new LocalStrategy((username, password, cb) => {
    db.query('SELECT id, email, password, type FROM users WHERE email=$1', [email], (err, result) => {
      if(err) {
        winston.error('Error when selecting user on login', err)
        return cb(err)
      }
  
      if(result.rows.length > 0) {
        const first = result.rows[0]
        bcrypt.compare(password, first.password, function(err, res) {
          if(res) {
            cb(null, { id: first.id, email: first.email, type: first.type })
           } else {
            cb(null, false)
           }
         })
       } else {
         cb(null, false)
       }
    })
  }))*/



  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  
  passport.deserializeUser((id, cb) => {
    client.query('SELECT u.*, ur.name as role_name  FROM users as u Join user_roles as ur ON u.role_id=ur.id WHERE u.id = $1', [parseInt(id, 10)], (err, results) => {
      if(err) {
        winston.error('Error when selecting user on session deserialize', err)
        return cb(err)
      }
  
      cb(null, results.rows[0])
    })
  })