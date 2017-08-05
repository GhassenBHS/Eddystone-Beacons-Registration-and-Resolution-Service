/**
 * Created by ghassen on 15/04/17.
 */

const base64 = require('base-64');
const mongoose = require('mongoose');
const RegistredBeacons= require('../Models/beacon.js');
const validator = require('validator');
const Owners= require('../Models/owner.js') ;

exports.resolveEphemeralID=function (req,next,callback) {

    /**
     *  Verify user request
     */



    Owners.find({id:req.body.fb_id}, function (err, post) {
        if (err) return next(err);

        if (post.length===0) callback("owner not authenticated");

        else
        {

            var eid_to_resolve=base64.decode(req.body.eid) ;
            console.log(eid_to_resolve) ;

            if (!validator.isHexadecimal(eid_to_resolve))
            {
                callback("Ephemeral id to resolve should be in Hex format and base64 encoded") ;
                return
            }



            /**
             *  Parse all ephemeral ids in the database
             */

            RegistredBeacons.find({eid:eid_to_resolve,active:true}, function (err, post) {
                if (err) return next(err);

                if (post.length===0)  {

                    // check the past and future EIDs

                    RegistredBeacons.find({}, function (err, post) {
                        if (err) return next(err);

                        post.forEach(function (beacon) {
                            var pastEIDArray = beacon.pastEID ;
                            var futureEIDArray = beacon.futureEID ;

                            console.log(futureEIDArray) ;

                            if (pastEIDArray.length === 0 || futureEIDArray.length ===0) callback(false) ;
                            else {
                                var found = 0 ;
                                pastEIDArray.forEach(function (eid_past) {
                                    if (eid_past === eid_to_resolve)
                                    {
                                        found = 1 ;
                                        callback (true );
                                    }

                                }) ;

                                futureEIDArray.forEach(function (eid_future) {
                                    if (eid_future === eid_to_resolve) {
                                        found = 1 ;
                                        callback (true );
                                    }

                                }) ;

                                if (found === 0) callback (false) ;

                            }





                        }) ;
                    }) ;


                }
                else callback(true) ;

            });





        }



    });



};

