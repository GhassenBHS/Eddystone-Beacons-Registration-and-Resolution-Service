/**
 * Created by SPEED on 9/10/2016.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Blog= require('../Models/blog.js');
router.get('/', function(req, res, next) {
    Blog.find( function (err, blogs) {
        if (err) return next(err);
        res.json(blogs);
    });
});

router.post('/', function(req, res, next) {
    Blog.create(req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});


router.get('/:id', function(req, res, next) {
    Blog.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

router.put('/:id', function(req, res, next) {
    Blog.findByIdAndUpdate(req.params.id, req.body, function (err, post) {

        if (err) return next(err);
        res.json(post);

    });
});

router.delete('/:id', function(req, res, next) {
    Blog.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});


module.exports = router;