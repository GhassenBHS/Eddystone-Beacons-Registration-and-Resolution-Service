/**
 * Created by ghassen on 15/04/17.
 */
const eid_manager =require('../Eddystone/EidComputation') ;
const crypto = require('crypto');
const base64 = require('base-64');
const validator = require('validator');
const HKDF = require('hkdf');
const aesjs = require('aes-js');
var mongoose = require('mongoose');
var RegistredBeacons= require('../Models/beacon.js');


    /**
     *  Generate keypair
     */


const service = crypto.createECDH('secp256k1');

service.setPrivateKey('b9f3bef3436a80605a106675f6afa9fbdd612e178430c5471fcd53e9210ee5b2','hex') ;
const service_public_key = service.getPublicKey('hex') ;

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


    if (!validator.isBase64(request.body.beacon_public_key) || !validator.isBase64(request.body.service_public_key)
         || !validator.isBase64(request.body.eid))
    {
        callback("Verify encoding format") ;
        return
    }


    var beacon_public_key=base64.decode(request.body.beacon_public_key) ;
    var service_public_key=base64.decode(request.body.service_public_key) ;
    var scalar=request.body.scalar ;
    var beacon_time_seconds=request.body.beacon_time_seconds ;
    var eid=base64.decode(request.body.eid) ;

    // console.log(!validator.isHexadecimal(client_public_key) , !validator.isHexadecimal(client_shared_secret)
    //     , !validator.isInt(rotation_period,{min:1,max:15}) , !validator.isInt(time_stamp) , !validator.isHexadecimal(eid)) ;


    if (!validator.isHexadecimal(beacon_public_key) || !validator.isHexadecimal(service_public_key)
        || !validator.isInt(scalar,{min:1,max:15}) || !validator.isInt(beacon_time_seconds)
        || !validator.isHexadecimal(eid))

    {
        callback("Verify sent data") ;
        return
    }



    /**
     *  Generate the shared secret and check if it is valid
     */


    const shared_secret = service.computeSecret(Buffer.from(beacon_public_key,'hex'));

    if (shared_secret.toString('hex')==='0000000000000000000000000000000000000000000000000000000000000000')
    {
        // callback("NOTE: shared key is invalid, due to an invalid public key.") ;
        console.log("ok") ;

    }



    /**
     *  Compute the AES key using HKDF-sha256
     */

    var salt = service_public_key.concat(beacon_public_key) ;

    var hkdf = new HKDF('sha256', salt, shared_secret.toString('hex'));
    hkdf.derive('', 32, function(key) {

        var AESkey = key.toString('hex').substring(0,32);
        console.log("AES",AESkey) ;
        eid_manager.GetEid('ac43b2580b62261217d601d88277e587',scalar,beacon_time_seconds,function (service_eid) {

            console.log(service_eid) ;
            if (service_eid !== eid) callback('Not Equal eid') ;
            else {
                /**
                 *  Saves the identity key, rotation period, and time counter offset from real-time in its non-volatile storage.
                 */

                var new_beacon = {
                    identity_key:AESkey ,
                    rotation_period:scalar,
                    beacon_time_seconds : beacon_time_seconds,
                    eid : service_eid
                }  ;

                RegistredBeacons.create(new_beacon, function (err) {
                    if (err) return callback('Invalid id');
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
                });



            }

        }) ;



    });






};

















