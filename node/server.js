if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userController = require('./app/controllers/user.controller.js')
const advertisementController = require('./app/controllers/advertisement.controller.js')
const categoryController = require('./app/controllers/category.controller.js')

//const bcrypt = require('bcrypt');
const passport = require ('passport');
//const flash = require('express-flash');
//const session = require('express-session');

require('./app/config/passport');

//const { verifySignUp } = require("./app/middlewares");
//const { authJwt } = require("./app/middlewares");


const app = express();

var corsOptions = {
  origin: "http://localhost:4200"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session())

require('./app/routes/auth.routes')(app);


//service links
app.get('/api/getCategories' , categoryController.getAllCategories);
app.get('/api/countwaitingadv' , advertisementController.CountWaitingAdvertisements);
app.get('/api/user/confirmregistration/:token', userController.confirmRegistration);


//guest links
app.get('/api/advertisements' , advertisementController.getAllAds);
app.get('/api/advertisements/:id', advertisementController.getAdvById);

module.exports = {
  app
}
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});