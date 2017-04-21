var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var User= require('../Models/user.js');

var Registration= require('../Controllers/Registration');
var Resolution= require('../Controllers/Resolution');


/* GET rotation period and the service public key. */

router.get('/', function(req, res, next) {

    Registration.sendPublicKey(function (key,err) {

        if (err) return next(err);
        res.json({
            public_key: key,
            rotation_period_min: 5,
            rotation_period_max: 10

        });


    }) ;


});

router.post('/', function(req, res, next) {



    Registration.registerBeaconOwner(req,function (response,err) {
            if (err) return next(err);
            res.json(response);
        // User.create(req.body, function (err, post) {
        //     if (err) return next(err);
        //     res.json(post);
        // });

    }) ;



});


router.get('/:id', function(req, res, next) {
    User.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

router.put('/:id', function(req, res, next) {
    User.findByIdAndUpdate(req.params.id, req.body, function (err, post) {

        if (err) return next(err);
        res.json(post);

    });
});

router.delete('/:id', function(req, res, next) {
    User.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;
