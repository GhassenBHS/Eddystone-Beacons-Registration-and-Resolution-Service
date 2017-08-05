    /**
     * Created by ghassen on 27/04/17.
     */


    const RegistredBeacons= require('../Models/beacon.js');
    const validator = require('validator');
    const base64 = require('base-64');

    exports.deactivateBeacon=function (request,next,callback) {

        /**
         *  Validate user data
         */


        var deactivation_secret=base64.decode(request.body.deactivation_secret) ;
        console.log(deactivation_secret) ;

        if (!validator.isHexadecimal(deactivation_secret))
        {
            callback("Deactivation secret should be in Hex format and base64 encoded") ;
            return
        }

        console.log("sent",deactivation_secret) ;



        /**
         *  Parse all deactivation secrets
         */

        RegistredBeacons.findOneAndUpdate({deactivation_secret:deactivation_secret,active:true},{active:false}, function (err, post) {
            if (err) return next(err);
            console.log(post) ;
            if (post === null) callback("Authentication failed or Beacon already deactivated") ;
            else {
                console.log(post) ;
                callback("Beacon deactivated") ;

            }

        });



    };

    exports.activateBeacon=function (request,next,callback) {

        /**
         *  Validate user data
         */


        var activation_secret=base64.decode(request.body.activation_secret) ;
        console.log(activation_secret) ;

        if (!validator.isHexadecimal(activation_secret))
        {
            callback("activation secret should be in Hex format and base64 encoded") ;
            return
        }


        /**
         *  Parse all activation secrets
         */

        RegistredBeacons.findOneAndUpdate({activation_secret:activation_secret,active:false},{active:true}, function (err, post) {
            if (err) return next(err);
            console.log(post) ;
            if (post === null) callback("Authentication failed or Beacon already activated") ;
            else {
                console.log(post) ;
                callback("Beacon activated") ;

            }

        });

    };

    exports.deleteBeacon=function (request,next,callback) {

        /**
         *  Validate user data
         */



        var delete_secret=base64.decode(request.body.delete_secret) ;
        console.log(delete_secret) ;

        if (!validator.isHexadecimal(delete_secret))
        {
            callback("Deletion secret should be in Hex format and base64 encoded") ;
            return
        }


        /**
         *  Parse all deletion secrets
         */

        RegistredBeacons.findOneAndRemove({delete_secret:delete_secret}, function (err, post) {
            if (err) return next(err);
            console.log(post) ;
            if (post === null) callback("Authentication failed or Beacon not registered") ;
            else {
                console.log(post) ;
                callback("Beacon deleted") ;

            }

        });

    };