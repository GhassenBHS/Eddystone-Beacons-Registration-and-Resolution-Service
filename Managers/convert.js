/**
 * Created by ghassen on 20/04/17.
 */


exports.strToHexArray=function (str,callback) {

    var array=[] ;
    for (var i = 0; i < str.length; i += 2) {
        array.push("0x" + str.substr(i, 2));
    }
    var uint8_array_from_str = new Uint8Array(array);
    callback(uint8_array_from_str) ;
};

