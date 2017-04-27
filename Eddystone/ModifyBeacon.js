    /**
     * Created by ghassen on 27/04/17.
     */


    const aesjs = require('aes-js');

    strToHexArray=function (str) {

        var array=[] ;
        for (var i = 0; i < str.length; i += 2) {
            array.push("0x" + str.substr(i, 2));
        }

        return new Uint8Array(array) ;
    };

    exports.getSecretsActDeactDel= function(AESkey,callback)
    {
        var ik=strToHexArray(AESkey) ;
        var aesEcb = new aesjs.ModeOfOperation.ecb(ik);

        var deactivate_encrypted_bytes = aesEcb.encrypt(strToHexArray("64656163746976617465626561636f6e" ));
        var deactivation_secret = aesjs.utils.hex.fromBytes(deactivate_encrypted_bytes);
        var activate_encrypted_bytes = aesEcb.encrypt(strToHexArray("6163746976617465626561636f6e3030" ));
        var activation_secret = aesjs.utils.hex.fromBytes(activate_encrypted_bytes);
        var delete_encrypted_bytes = aesEcb.encrypt(strToHexArray("64656c657465626561636f6e30303030" ));
        var delete_secret = aesjs.utils.hex.fromBytes(delete_encrypted_bytes);

        var callbackSecrets = {};

        callbackSecrets.deactivation_secret=deactivation_secret ;
        callbackSecrets.activation_secret=activation_secret ;
        callbackSecrets.delete_secret=delete_secret ;

        callback(callbackSecrets) ;

    };