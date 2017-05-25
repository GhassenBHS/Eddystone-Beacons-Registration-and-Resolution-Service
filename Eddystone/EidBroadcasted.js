/**
 * Given the identity key, the beacon rotation exponent, and the times of
 registration for the beacon and the service, this computes the eid that the
 beacon is currently broadcasting.
 */


const eid_manager =require('../Eddystone/EidComputation') ;
var i=0 ;

exports.GetEidBroadcasted = function (AESkey, scaler, beacon_initial_time_seconds,service_initial_time_seconds, callback) {

    i=i+1000 ;

    var d = new Date();
    var current_seconds = Math.round(d.getTime() / 1000)+i;
    var beacon_time_seconds = beacon_initial_time_seconds + (current_seconds - service_initial_time_seconds) ;
    var quantum = Math.floor(beacon_time_seconds / Math.pow(2,scaler)) ;
    // console.log("Beacon time in seconds:",beacon_time_seconds) ;
    // console.log("Beacon quantum:",quantum) ;
    // console.log("Start of quantum:",quantum * Math.pow(2,scaler)) ;
    // console.log("End of quantum:",(quantum+1) * Math.pow(2,scaler)) ;

    eid_manager.GetEid(AESkey,scaler,beacon_time_seconds,function (broadcasted_eid) {

        console.log("Broadcasted ephemeral id: ",broadcasted_eid) ;
        callback(broadcasted_eid) ;


    }) ;

} ;