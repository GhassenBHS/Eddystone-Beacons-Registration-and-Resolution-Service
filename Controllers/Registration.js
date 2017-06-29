/**
 * Created by ghassen on 15/04/17.
 */
const EidComputation =require('../Eddystone/EidComputation') ;
const EidBroadcasted =require('../Eddystone/EidBroadcasted') ;
const ModifyBeacon =require('../Eddystone/ModifyBeacon') ;
const RegistredBeacons= require('../Models/beacon.js');
const crypto = require('crypto');
const base64 = require('base-64');
const validator = require('validator');
const HKDF = require('hkdf');
const aesjs = require('aes-js');
const mongoose = require('mongoose');
const cache = require('memory-cache');





    /**
     *  Generate keypair
     */


const service = crypto.createECDH('secp256k1');


service.setPrivateKey('b9f3bef3436a80605a106675f6afa9fbdd612e178430c5471fcd53e9210ee5b2','hex') ;
const service_public_key = service.getPublicKey('hex') ;
const service_initial_time_seconds = 0 ;

exports.sendPublicKey=function (callback) {

    callback(base64.encode(service_public_key)) ;

};


    /**
     *  Register the Beacon
     */

exports.registerBeaconOwner=function (request,callback) {
    /**
     *  Verify user request
     */


    // if (!validator.isBase64(request.body.beacon_public_key) || !validator.isBase64(request.body.service_public_key)
    //      || !validator.isBase64(request.body.eid))
    // {
    //     callback("Verify encoding format") ;
    //     return
    // }


    // var beacon_public_key=base64.decode(request.body.beacon_public_key) ;
    // var service_public_key=base64.decode(request.body.service_public_key) ;
    // var scalar=request.body.scalar ;
    // var beacon_time_seconds=request.body.beacon_time_seconds ;
    // var beacon_initial_time_seconds=request.body.beacon_initial_time_seconds ;
    // var eid=base64.decode(request.body.eid) ;

    var beacon_public_key=request.body.beacon_public_key ;
    var service_public_key=request.body.service_public_key ;
    var scalar=request.body.scalar ;
    var beacon_time_seconds=request.body.beacon_time_seconds ;
    var beacon_initial_time_seconds=request.body.beacon_initial_time_seconds ;
    var eid=request.body.eid ;


    if (!validator.isHexadecimal(beacon_public_key) || !validator.isHexadecimal(service_public_key)
        || !validator.isInt(scalar,{min:5,max:15}) || !validator.isInt(beacon_time_seconds)
        || !validator.isInt(beacon_initial_time_seconds) || !validator.isHexadecimal(eid))

    {
        callback("Verify sent data") ;
        return
    }



    /**
     *  Generate the shared secret and check if it is valid
     */


    const shared_secret = service.computeSecret(Buffer.from(beacon_public_key,'hex'));
    console.log("shared",shared_secret) ;

    if (shared_secret.toString('hex')==='0000000000000000000000000000000000000000000000000000000000000000')
    {
        callback("Error, null shared secret") ;

    }



    /**
     *  Compute the AES key using HKDF-sha256
     */

    var salt = service_public_key.concat(beacon_public_key) ;

    var hkdf = new HKDF('sha256', salt, shared_secret.toString('hex'));
    hkdf.derive('', 32, function(key) {

        var AESkey = key.toString('hex').substring(0,32);
        console.log("AES",AESkey) ;

        /**
         *  Compute the secrets for the activation, deactivation and deletion using the identity key.
         */

        ModifyBeacon.getSecretsActDeactDel(AESkey,function (secrets) {

            var deactivation_secret = secrets.deactivation_secret ;
            var activation_secret = secrets.activation_secret ;
            var delete_secret = secrets.delete_secret ;

            console.log("scaler",beacon_time_seconds) ;


            EidComputation.GetEid(AESkey,scalar,beacon_time_seconds,function (service_eid) {

                console.log("service eid: ",service_eid) ;
                if (service_eid !== eid) callback('Not Equal eid') ;
                else {


                    /**
                     *  Saves the identity key, rotation period, and time counter offset from real-time in its non-volatile storage.
                     */

                    var new_beacon = {
                        _id:AESkey ,
                        rotation_period:scalar,
                        beacon_initial_time_seconds : beacon_initial_time_seconds,
                        eid : service_eid,
                        active: true,
                        deactivation_secret:deactivation_secret ,
                        activation_secret: activation_secret ,
                        delete_secret:delete_secret
                    }  ;




                    RegistredBeacons.create(new_beacon, function (err) {
                        if (err) { console.log(err) ;callback('Invalid id'); return }

                        /**
                         *  Launch a thread that update the eid in the database every 2^k seconds
                         *  Before that, we need to make the first update of eid synchronised with the
                         *  beacon quantum start otherwise broadcasted eids won't match
                         */


                        callback( {"advertisedId": {type:"EDDYSTONE", "id":"<beacon_id>"},
                                status:"ACTIVE",
                                ephemeral_id_registration:  {
                                    beacon_ecdh_public_key:beacon_public_key ,
                                    service_ecdh_public_key: service_public_key,
                                    initial_clock_value:beacon_time_seconds,
                                    rotation_period_exponent:scalar,
                                    initial_eidr:service_eid
                                }
                            }


                        ) ;

                        var d = new Date();
                        var current_seconds = Math.round(d.getTime() / 1000);
                        var current_beacon_time_seconds = beacon_initial_time_seconds + (current_seconds - service_initial_time_seconds) ;
                        var quantum = Math.floor(current_beacon_time_seconds / Math.pow(2,scalar)) ;
                        var endQunatum = (quantum+1) * Math.pow(2,scalar);
                        var current_seconds_in_quantum =  Math.floor(endQunatum-current_beacon_time_seconds) ;

                        console.log("Beacon time in seconds:",current_beacon_time_seconds) ;
                        console.log("Beacon quantum:",quantum) ;
                        console.log("Start of quantum:",quantum * Math.pow(2,scalar)) ;
                        console.log("End of quantum:",(quantum+1) * Math.pow(2,scalar)) ;



                        console.log("How long we'll wait: ",current_seconds_in_quantum);


                        setTimeout(function () {

                            // SetInterval do not execute immediately, therefore we call GetEidBroadcasted to make
                            // it as if immediately executed without waiting 2^scalar

                            EidBroadcasted.GetEidBroadcasted(AESkey,scalar,beacon_initial_time_seconds,service_initial_time_seconds,function (res) {

                                console.log("res_after update_first",res) ;
                                var date = new Date();
                                RegistredBeacons.findByIdAndUpdate(AESkey, {eid:res,updated_at:date}, function (err, post) {

                                    if (err) return next(err);
                                    console.log(post);


                                    setInterval( function () {

                                        EidBroadcasted.GetEidBroadcasted(AESkey,scalar,beacon_initial_time_seconds,service_initial_time_seconds,function (res) {

                                            console.log("res_after update",res) ;
                                            var date = new Date();
                                            RegistredBeacons.findByIdAndUpdate(AESkey, {eid:res,updated_at:date}, function (err, post) {

                                                if (err) return next(err);
                                                console.log(post);

                                            });


                                        })

                                    } , Math.pow(2,scalar)*1000) ;

                                });


                            }) ;
                        }, current_seconds_in_quantum*1000);

                    });



                }

            }) ;


        }) ;






    });






};



















