/**
 * Created by ghassen on 15/04/17.
 */
const managers =require('../Managers/convert')
const crypto = require('crypto');
const base64 = require('base-64');
const validator = require('validator');
const HKDF = require('hkdf');
const aesjs = require('aes-js');


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

        /**
         *  Compute the ephemeral id using AESkey, scaler and beacon_time_seconds
         *  first compute temporary key data
         *  second compute ephemeral id
         */


        var tstk0 = String.fromCharCode((beacon_time_seconds / (Math.pow(2, 24))) % 256) ;
        var tstk1 = String.fromCharCode((beacon_time_seconds / Math.pow(2, 16)) % 256) ;
        var tkdata = "0000000000000000000000ff0000" + tstk0.charCodeAt(0).toString(16)+ tstk1.charCodeAt(0).toString(16) ;
        console.log( "Temporary Key data", tkdata) ;

        managers.strToHexArray(AESkey,function (ik) {

            var aesEcbTk = new aesjs.ModeOfOperation.ecb(ik);

            managers.strToHexArray(tkdata,function (tkdata_hex_array) {

                console.log(tkdata_hex_array) ;

                var tk_encrypted_bytes = aesEcbTk.encrypt(tkdata_hex_array);
                var tk = aesjs.utils.hex.fromBytes(tk_encrypted_bytes);
                console.log("Temporary Key", tk);

                // compute eid

                var tseid0 = String.fromCharCode((beacon_time_seconds / (Math.pow(2, 24))) % 256) ;
                var tseid1 = String.fromCharCode((beacon_time_seconds / Math.pow(2, 16)) % 256) ;
                var tseid2 = String.fromCharCode((beacon_time_seconds / (Math.pow(2, 8))) % 256) ;
                var tseid3 = String.fromCharCode((beacon_time_seconds / Math.pow(2, 0)) % 256) ;
                var eiddata = "0000000000000000000000" + scalar.charCodeAt(0).toString(16)+
                    tseid0.charCodeAt(0).toString(16)+ tseid1.charCodeAt(0).toString(16) +
                    tseid2.charCodeAt(0).toString(16)+ tseid3.charCodeAt(0).toString(16) ;
                console.log("Ephemeral Id data",eiddata) ;

                // managers.strToHexArray(tk,function (tk_hex_array) {
                //
                //     var aesEcbEi = new aesjs.ModeOfOperation.ecb(tk_hex_array);
                //
                //     managers.strToHexArray(eiddata,function (eiddata_hex_array) {
                //
                //         var ei_encrypted_bytes = aesEcbEi.encrypt(eiddata_hex_array);
                //         var eid = aesjs.utils.hex.fromBytes(ei_encrypted_bytes);
                //         console.log("Ephemeral Id",eid);
                //
                //     }) ;
                //
                //
                //
                //
                //
                // }) ;





            });

        });







    });



    callback("good") ;


};

















