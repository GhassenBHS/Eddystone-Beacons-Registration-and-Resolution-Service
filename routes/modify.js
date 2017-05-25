    /**
     * Created by ghassen on 27/04/17.
     */
    const express = require('express');
    const router = express.Router();
    const Modification= require('../Controllers/Modification') ;



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
        Modification.deactivateBeacon(req,next,function (response) {
            res.json(response) ;

        })
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
        Modification.activateBeacon(req,next,function (response) {
            res.json(response) ;

        })
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
        Modification.deleteBeacon(req,next,function (response) {
            res.json(response) ;

        })
    });

    module.exports = router;
