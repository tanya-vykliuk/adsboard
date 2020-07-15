const { verifySignUp } = require("../middlewares");
const { authJwt } = require("../middlewares");
const userController = require('../controllers/user.controller.js')
const advertisementController = require('../controllers/advertisement.controller.js')
const categoryController = require('../controllers/category.controller.js')
const passport = require ('passport');


module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  passport.authenticate('jwt', { session: false })

  app.post('/api/user/registration', [
    verifySignUp.checkDuplicateEmail,
    verifySignUp.checkRolesExisted
  ], userController.registerUser);

app.post("/api/user/login", userController.loginUser);

//user links
app.get('/api/user/getAllForUser',passport.authenticate('jwt', { session: false }), 
advertisementController.getAllForUser);

app.get('/api/user/getUserById/:id',passport.authenticate('jwt', { session: false }), 
userController.getUserById);


app.post('/api/createadvertisement',passport.authenticate('jwt', { session: false }), 
advertisementController.createAdvertisement);

app.post('/api/publishAdvertisement',passport.authenticate('jwt', { session: false }), 
advertisementController.publishAdvertisement);

app.post('/api/deleteAdvertisement',passport.authenticate('jwt', { session: false }), 
advertisementController.deleteAdvertisement);
 


//manager links
app.get('/api/user/getAllForManager' ,passport.authenticate('jwt', { session: false }), 
advertisementController.getAllForManager);

app.post('/api/approveAdvertisement',passport.authenticate('jwt', { session: false }), 
advertisementController.approveAdvertisement);

app.post('/api/rejectAdvertisement',passport.authenticate('jwt', { session: false }), 
advertisementController.rejectAdvertisement);


//admin links
app.get('/api/user/getUsers', passport.authenticate('jwt', { session: false }), userController.getUsers);
app.get('/api/getCategory/:id', passport.authenticate('jwt', { session: false }), categoryController.getCategory);

app.post('/api/deleteAdvertisement',passport.authenticate('jwt', { session: false }), advertisementController.deleteAdvertisement);
app.post('/api/deleteCategory',passport.authenticate('jwt', { session: false }), categoryController.deleteCategory);
app.post('/api/saveCategory',passport.authenticate('jwt', { session: false }), categoryController.saveCategory);

};