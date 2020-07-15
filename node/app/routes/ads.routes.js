module.exports = app => {
    //const adsController = require("../controllers/ads.controller.js");
    const db = require('./app/db/queries.js')
  
    //var router = require("express").Router();
  
    // Retrieve all Tutorials
    //router.get("/", adsController.findAll);
  
    //app.use('/api/advertisements', router);
    app.get('/api/advertisements', db.getAllAds);
    app.get('/api/advertisements/:id', db.getAdvById);
  };