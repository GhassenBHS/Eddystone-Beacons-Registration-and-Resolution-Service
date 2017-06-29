/**
 * Created by SPEED on 9/10/2016.
 */
var express = require('express');
var router = express.Router();
var routeCache = require('route-cache');


var Resolution= require('../Controllers/Resolution');

router.post('/' ,function(req, res, next) {

    Resolution.resolveEphemeralID(req,next,function (isResolved) {

        res.json(isResolved);



    }) ;


});



module.exports = router;