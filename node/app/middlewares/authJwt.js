const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
/*const db = require("../models");
const User = db.user;*/

const userController = require('../controllers/user.controller.js')

verifyToken = (req, res, next) => {  
  let token = req.headers["x-access-token"] || req.headers['authorization'];
  console.log('headers');
  console.log(req.headers)
  /*if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }
  */
  if (!token) {    
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {  
      console.log(err)   
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isUser = (req, res, next) => {
  user = userController.getUserInfoById(req.userId);
  //console.log(user.role_name)
  if(user.role_name == 'user'){  
    next();
    return;
  }
  res.status(403).send({
    message: "Require User Role!"
  });
  return;
    
};

isAdmin = (req, res, next) => {
  user = userController.getUserInfoById(req.userId);
  console.log(user.role_name)
  if(user.role_name == 'admin'){  
    next();
    return;
  }
  res.status(403).send({
    message: "Require Admin Role!"
  });
  return;
};

isManager = (req, res, next) => {
  user = userController.getUserInfoById(req.userId);
  console.log(user.role_name)
  if(user.role_name == 'manager'){  
    next();
    return;
  }
  res.status(403).send({
    message: "Require Manager Role!"
  });
  return;
};

isModeratorOrAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "manager") {
          next();
          return;
        }

        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Moderator or Admin Role!"
      });
    });
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isUser: isUser,
  isAdmin: isAdmin,
  isManager: isManager,
  isModeratorOrAdmin: isModeratorOrAdmin
};
module.exports = authJwt;