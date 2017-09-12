/**
 * Created by ghassen on 11/05/17.
 */



window.get_shared_secret= function (beacon_private_key,service_public_key,callback) {


    var EC = require('elliptic').ec;
    var ec = new EC('secp256k1');
    var HKDF = require('hkdf');
    const validator = require('validator');

    if (!validator.isHexadecimal(beacon_private_key) || !validator.isHexadecimal(service_public_key) )


    {
        callback("data not HEX") ;
        return
    }



    var beacon = ec.keyFromPrivate(beacon_private_key,'hex');
    var service = ec.keyFromPublic(service_public_key,'hex') ;
    var beacon_public_key = beacon.getPublic('hex') ;
    var shared_secret = beacon.derive(service.getPublic(),'hex');

    /**
     *  Compute the AES key using HKDF-sha256
     */

    var salt = service_public_key.concat(beacon_public_key) ;
    var hkdf = new HKDF('sha256', salt, shared_secret.toString('hex'));
    hkdf.derive('', 32, function(key) {

        var AESkey = key.toString('hex').substring(0, 32);
        callback(AESkey);
    }) ;






} ;
