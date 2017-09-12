/**
 * Created by ghassen on 17/05/17.
 */



define(function () {

    return {

       modify_beacon: function (ik,new_status,callback) {
            requirejs.config({

                paths: {
                    cryptojs: '../node_modules/crypto-js/crypto-js'
                }
            });
            requirejs(['cryptojs','base64'], function( CryptoJS, base64 ) {

                var key = CryptoJS.enc.Hex.parse(ik) ;

                if (new_status === 'deactivate')
                {


                    var deactivation_data = CryptoJS.enc.Hex.parse("64656163746976617465626561636f6e") ;
                    var deactivation_secret = CryptoJS.AES.encrypt(deactivation_data,key,{mode: CryptoJS.mode.ECB});
                    callback(base64.encode(deactivation_secret.ciphertext.toString().substring(0,32)));



                }
                else if (new_status === 'activate')
                {

                    var activation_data = CryptoJS.enc.Hex.parse("6163746976617465626561636f6e3030") ;
                    var activation_secret = CryptoJS.AES.encrypt(activation_data,key,{mode: CryptoJS.mode.ECB});
                    callback(base64.encode(activation_secret.ciphertext.toString().substring(0,32))) ;



                }
                else if (new_status === 'delete')
                {

                    var delete_data = CryptoJS.enc.Hex.parse("64656c657465626561636f6e30303030") ;
                    var delete_secret = CryptoJS.AES.encrypt(delete_data,key,{mode: CryptoJS.mode.ECB});
                    callback(base64.encode(delete_secret.ciphertext.toString().substring(0,32))) ;


                }
                else callback('Error') ;






            }) ;

        }


    }



}) ;







