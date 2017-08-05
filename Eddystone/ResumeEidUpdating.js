/**
 * Created by ghassen on 15/07/17.
 */
const mongoose = require('mongoose');
const RegistredBeacons= require('../Models/beacon.js');
const EidComputation =require('../Eddystone/EidComputation') ;
const EidBroadcasted =require('../Eddystone/EidBroadcasted') ;
const ClockDrift =require('../Eddystone/ClockDrift') ;


exports.resumeUpdatingEid=function (callback) {

RegistredBeacons.find({}, function (err, post) {
    if (err) return next(err);

    if (post.length===0)

        callback(false) ;



    /**
     *  The database contains registered beacons. We resume
     *  updating eid after server restart.
     */

    else {
        var service_initial_time_seconds = 0 ;

       post.forEach(function (beacon) {

           // First for each beacon we focus on synchronization
           // Get actual time and in which quantum the beacon is currently broadcasting
           
           var beacon_initial_time_seconds = parseInt(beacon.beacon_initial_time_seconds) ;
           var scaler = parseInt(beacon.rotation_period) ;

           var d = new Date();
           var current_seconds = Math.round(d.getTime() / 1000);
           var current_beacon_time_seconds = beacon_initial_time_seconds+ (current_seconds - service_initial_time_seconds) ;
           var quantum = Math.floor(current_beacon_time_seconds / Math.pow(2,scaler)) ;
           var endQunatum = (quantum+1) * Math.pow(2,scaler);
           var current_seconds_in_quantum =  Math.floor(endQunatum-current_beacon_time_seconds) ;


           console.log("Synchronize in : ",current_seconds_in_quantum);

           setTimeout(function () {

               // SetInterval do not execute immediately, therefore we call GetEidBroadcasted to make
               // it as if immediately executed without waiting 2^scalar

               EidBroadcasted.GetEidBroadcasted(beacon._id,scaler,beacon_initial_time_seconds,service_initial_time_seconds,function (res) {


                   ClockDrift.computePastFutureEIDs(beacon._id,scaler,beacon_initial_time_seconds,service_initial_time_seconds,
                       function (drift) {

                           console.log(drift) ;

                       }) ;

                   console.log("res_after update_first",res) ;
                   var date = new Date();
                   RegistredBeacons.findByIdAndUpdate(beacon._id, {eid:res,updated_at:date}, function (err, post) {

                       if (err) return next(err);
                       console.log(post);
                       callback('Ok');


                       setInterval( function () {

                           EidBroadcasted.GetEidBroadcasted(beacon._id,scaler,beacon_initial_time_seconds,service_initial_time_seconds,function (res) {

                               console.log("res_after update",res) ;
                               var date = new Date();
                               RegistredBeacons.findByIdAndUpdate(beacon._id, {eid:res,updated_at:date}, function (err, post) {

                                   if (err) return next(err);
                                   console.log(post);

                                   // Deal with drift





                               });


                           })

                       } , Math.pow(2,scaler)*1000) ;

                   });


               }) ;
           }, current_seconds_in_quantum*1000);





       })


    }

})};