/**
 * Created by ghassen on 20/04/17.
 */
const aesjs = require('aes-js');
const cache = require('memory-cache');

strToHexArray=function (str) {

    var array=[] ;
    for (var i = 0; i < str.length; i += 2) {
        array.push("0x" + str.substr(i, 2));
    }
    return new Uint8Array(array) ;
};


toHex= function(str) {
    var hex = '';
    for(var i=0;i<str.length;i++) {


        if (str.charCodeAt(i).toString(16).length === 0)
            hex += "00";
        else if (str.charCodeAt(i).toString(16).length === 1)
            hex="0"+''+str.charCodeAt(i).toString(16) ;
        else
            hex=hex += ''+str.charCodeAt(i).toString(16);

    }
    return hex;
} ;


/**
 *  Compute the ephemeral id using AESkey, scaler and beacon_time_seconds
 *  first compute temporary key data
 *  second compute ephemeral id
 */

exports.GetEid = function (AESkey, scalar, beacon_time_seconds, callback) {


    var cached_tk = cache.get('temporary_key') ;
    if (cached_tk === null) {

        var tstk0 = String.fromCharCode(Math.floor(beacon_time_seconds / Math.pow(2, 24)) % 256);
        var tstk1 = String.fromCharCode(Math.floor(beacon_time_seconds / Math.pow(2, 16)) % 256);
        var tkdata = "0000000000000000000000ff0000" + tstk0.charCodeAt(0).toString(16) + tstk1.charCodeAt(0).toString(16);
        console.log("Temporary Key data", tkdata);

        var ik = strToHexArray(AESkey);
        var aesEcbTk = new aesjs.ModeOfOperation.ecb(ik);
        var tkdata_hex_array = strToHexArray(tkdata);

        console.log(tkdata_hex_array);

        var tk_encrypted_bytes = aesEcbTk.encrypt(tkdata_hex_array);
        cached_tk = aesjs.utils.hex.fromBytes(tk_encrypted_bytes);
        console.log("Temporary Key", cached_tk);

        cache.put('temporary_key', cached_tk, 65536000, function (key, value) {
            console.log(key + ' did ' + value);
        }); // Time in ms
    }



        /**
         * Compute eid
         * Beacon time counter, in 32-bit big-endian format. The K lowest bits are cleared.
         */


        beacon_time_seconds = Math.floor(beacon_time_seconds / Math.pow(2, scalar)) * Math.pow(2, scalar);

        var tseid0 = String.fromCharCode(Math.floor(beacon_time_seconds / Math.pow(2, 24)) % 256);
        var tseid1 = String.fromCharCode(Math.floor(beacon_time_seconds / Math.pow(2, 16)) % 256);
        var tseid2 = String.fromCharCode(Math.floor(beacon_time_seconds / Math.pow(2, 8)) % 256);
        var tseid3 = String.fromCharCode(Math.floor(beacon_time_seconds / Math.pow(2, 0)) % 256);
        var eiddata = "0000000000000000000000" + toHex(String.fromCharCode(scalar)) +
            toHex(tseid0) + toHex(tseid1) + toHex(tseid2) + toHex(tseid3);

        console.log("Ephemeral Id data", eiddata);

        var tk_hex_array = strToHexArray(cached_tk);
        var aesEcbEi = new aesjs.ModeOfOperation.ecb(tk_hex_array);
        var eiddata_hex_array = strToHexArray(eiddata);
        var ei_encrypted_bytes = aesEcbEi.encrypt(eiddata_hex_array);
        var eid = aesjs.utils.hex.fromBytes(ei_encrypted_bytes).substring(0, 16);
        callback(eid);

} ;



