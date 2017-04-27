    /**
     * Created by ghassen on 27/04/17.
     */
    const express = require('express');
    const router = express.Router();

    const RegistredBeacons= require('../Models/beacon.js');
    const Registration= require('../Controllers/Registration');
    const Resolution= require('../Controllers/Resolution');



    /**
     * Request by owner to deactivate his registered beacon.
     *
     * The owner sends this 128 bits HEX string: "64656163746976617465626561636f6e" encrypted by his 128 bits identity key in HEX format with AES128.
     * NOTE: the string is "deactivatebeacon" in HEX format: "64656163746976617465626561636f6e".
     *
     * Parse the field "deactivation_secret" from database which is computed offline and compare it with the sent encryption, if there is a match,
     * beacon owner is then authenticated.
     *
     * If Beacon is already deactivated, warning message is sent in response
     */


    router.put('/deactivate', function(req, res, next) {
        RegistredBeacons.findByIdAndUpdate(req.params.id, req.body, function (err, post) {

            if (err) return next(err);
            res.json(post);

        });
    });


    /**
     * Request by owner to activate his registered beacon.
     *
     * The owner sends this 128 bits HEX string: "6163746976617465626561636f6e3030" encrypted by his 128 bits identity key in HEX format with AES128.
     * NOTE: the string is "activatebeacon00" in HEX format: "6163746976617465626561636f6e3030".
     *
     * Parse the field "activation_secret" from database which is computed offline and compare it with the sent encryption, if there is a match,
     * beacon owner is then authenticated.
     *
     * If Beacon is already activated, warning message is sent in response
     */

    router.put('/activate', function(req, res, next) {
        RegistredBeacons.findByIdAndUpdate(req.params.id, req.body, function (err, post) {

            if (err) return next(err);
            res.json(post);

        });
    });

    /**
     * Request by owner to delete his registered beacon.
     *
     * The owner sends this 128 bits HEX string: "64656c657465626561636f6e30303030" encrypted by his 128 bits identity key in HEX format with AES128.
     * NOTE: the string is "deletebeacon0000" in HEX format: "64656c657465626561636f6e30303030".
     *
     * Parse the field "delete_secret" from database which is computed offline and compare it with the sent encryption, if there is a match,
     * beacon owner is then authenticated.
     */

    router.delete('/delete', function(req, res, next) {
        RegistredBeacons.findByIdAndRemove(req.params.id, req.body, function (err, post) {
            if (err) return next(err);
            res.json(post);
        });
    });

    module.exports = router;
