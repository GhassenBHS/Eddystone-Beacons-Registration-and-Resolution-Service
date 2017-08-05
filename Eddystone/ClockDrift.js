/**
 * Deal with beacon drift
 */

const RegistredBeacons= require('../Models/beacon.js');
const eid_manager =require('../Eddystone/EidComputation') ;

exports.computePastFutureEIDs = function (AESkey, scaler, beacon_initial_time_seconds,service_initial_time_seconds, callback) {


    var d = new Date();
    var current_seconds = Math.round(d.getTime() / 1000);
    var beacon_time_seconds = beacon_initial_time_seconds + (current_seconds - service_initial_time_seconds) ;
    var quantum = Math.floor(beacon_time_seconds / Math.pow(2,scaler)) ;
    // console.log("Beacon time in seconds:",beacon_time_seconds) ;
    // console.log("Beacon quantum:",quantum) ;
    // console.log("Start of quantum:",quantum * Math.pow(2,scaler)) ;
    // console.log("End of quantum:",(quantum+1) * Math.pow(2,scaler)) ;


    /**
     *  get registration time
     */

    RegistredBeacons.find({_id:AESkey,active:true}, function (err, post) {
        if (err) return next(err);

        console.log(AESkey);

        if (post.length===0) callback("error") ;

        else
        {
            console.log("created at",Math.floor(post[0].created_at.getTime()/1000));
            var created_at = Math.floor(post[0].created_at.getTime()/1000) ;

            var d = new Date();
            var current_seconds = Math.round(d.getTime() / 1000);
            var beacon_time_seconds = beacon_initial_time_seconds + (current_seconds - service_initial_time_seconds) ;
            var quantum = Math.floor(beacon_time_seconds / Math.pow(2,scaler)) ;
            var startQuantum = quantum * Math.pow(2,scaler) ;
            var endQuantum = (quantum+1) * Math.pow(2,scaler) ;
            console.log("Start of quantum:",quantum * Math.pow(2,scaler)) ;
            console.log("End of quantum:",(quantum+1) * Math.pow(2,scaler)) ;

            var timeSinceRegistration = beacon_time_seconds - created_at ;
            // Now determine drift to know how many Past and Future EIDs to compute
            // for every 1 000 000 s we have + or - 500 s

            var driftInSeconds = Math.floor(timeSinceRegistration/2000);

            // How many rotation period in that drift <=> How many EIDs to compute + 1

            console.log("drift",driftInSeconds) ;

            // var EIDsToCompute = Math.floor(driftInSeconds / Math.pow(2,scaler))+1 ;
            var EIDsToCompute = 5 ;

            if (EIDsToCompute<1) callback('No EIDs to compute') ;
            else {
                // compute x past & future EIDs
                // we should find out each past EID took place at which time interval,
                // we search for the intervals and get their centers

                var pastRotationPeriodCentersArray = [];
                var futureRotationPeriodCentersArray = [];
                for (var i = 1; i < EIDsToCompute+1; i++) {

                    var pastIntervalCenter = startQuantum - Math.floor(Math.pow(2,scaler)/2);
                    var futureIntervalCenter = endQuantum + Math.floor(Math.pow(2,scaler)/2);
                    startQuantum = startQuantum - Math.pow(2,scaler) ;
                    endQuantum = endQuantum + Math.pow(2,scaler) ;
                    pastRotationPeriodCentersArray.push(pastIntervalCenter);
                    futureRotationPeriodCentersArray.push(futureIntervalCenter);
                }
                console.log("array of centers", pastRotationPeriodCentersArray) ;
                var EIDsPastArray = [] ;
                var EIDsFutureArray = [] ;

                pastRotationPeriodCentersArray.forEach(function(current_value) {

                    eid_manager.GetEid(AESkey,scaler,current_value,function (broadcasted_eid) {

                        console.log("Broadcasted ephemeral id PAST: ",broadcasted_eid) ;
                        callback(broadcasted_eid) ;
                        EIDsPastArray.push(broadcasted_eid) ;



                    }) ;



                });
                futureRotationPeriodCentersArray.forEach(function(current_value) {

                    eid_manager.GetEid(AESkey,scaler,current_value,function (broadcasted_eid) {

                        console.log("Broadcasted ephemeral id FUTURE: ",broadcasted_eid) ;
                        callback(broadcasted_eid) ;
                        EIDsFutureArray.push(broadcasted_eid) ;



                    }) ;



                });

                // For each is blocking so here we are sure the EIDsPastArray is done

                RegistredBeacons.findOneAndUpdate({_id:AESkey,active:true},{pastEID:EIDsPastArray,futureEID:EIDsFutureArray},
                    function (err, post) {
                    if (err) return next(err);
                    if (post === null) callback("Error updating FUTURE/PAST EIDs field") ;
                    else {
                        console.log(post) ;
                        callback("FUTURE/PAST EID computed successfully") ;

                    }

                });






            }






        }



    });







} ;