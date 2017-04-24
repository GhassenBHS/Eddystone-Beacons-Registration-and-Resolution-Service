/**
 * Created by SPEED on 9/10/2016.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User= require('../Models/beacon.js');
router.get('/', function(req, res, next) {
    User.find( function (err, blogs) {
        if (err) return next(err);
        res.json(blogs);
    });
});

router.post('/', function(req, res, next) {
    User.create(req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});



module.exports = router;