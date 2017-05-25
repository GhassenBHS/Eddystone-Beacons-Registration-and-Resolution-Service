    const express = require('express');
    const router = express.Router();

    const Registration= require('../Controllers/Registration');
    const Resolution= require('../Controllers/Resolution');


    /**
     * GET rotation period and the service public key.
     */


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

    /**
     * Request by owner to register a beacon
     * The owner sends beacon_public_key, service_public_key, scalar, beacon_time_seconds, beacon_initial_time_seconds and eid
     */

    router.post('/', function(req, res, next) {


        Registration.registerBeaconOwner(req,function (response,err) {
            if (err) return next(err);

            res.json(response);
            console.log("server response: ",response) ;
        }) ;



    });


    module.exports = router;
