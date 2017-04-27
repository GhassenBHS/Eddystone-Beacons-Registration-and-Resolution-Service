/**
 * Created by ghassen on 15/04/17.
 */

const base64 = require('base-64');
const mongoose = require('mongoose');
const RegistredBeacons= require('../Models/beacon.js');
const validator = require('validator');

exports.resolveEphemeralID=function (req,next,callback) {

    /**
     *  Verify user request
     */


    if (!validator.isBase64(req.body.eid) )
    {
        callback("Verify encoding format") ;
        return
    }

    var eid_to_resolve=base64.decode(req.body.eid) ;
    console.log(eid_to_resolve) ;

    if (!validator.isHexadecimal(eid_to_resolve))
    {
        callback("Ephemeral id to resolve schould be in Hex format") ;
        return
    }



    /**
     *  Parse all ephemeral ids in the database
     */

    RegistredBeacons.find({eid:eid_to_resolve,active:true}, function (err, post) {
        if (err) return next(err);
        if (post === null) callback(false) ;
        else callback(true) ;

    });






};

