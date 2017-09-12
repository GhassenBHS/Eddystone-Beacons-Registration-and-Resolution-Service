/**
 * Created by ghassen on 04/05/17.
 */

$(document).ready(function() {
    // $("#modifyForm").hide();






$('#modifyForm').trigger("reset");
var rows_counter = 0 ;
    requirejs.config({
        // baseUrl: './Model',
        paths: {

            couchdbManager: './Model/couchdbManager',
            validator: '../node_modules/validator-js/validator',
            modify: '../Eddystone/modifyStatus'
        }
    });





    requirejs(['couchdbManager'], function( Model ) {
        Model.bind_beacons_list(function (beacons_json) {
            // console.log("callback: ",beacons_json) ;

            $.each(beacons_json, function (index,value) {

                var reg_time = new Date(value.RegistrationTime).toDateString();
                $("#beacons_list tbody").append('<tr><td>'+ rows_counter+'</td><td>'+ value.SharedSecret+'</td><td>'+ value.InitialTime+'</td>' +
                    '<td>'+ value.Status+'</td><td>'+ reg_time+'</td> </tr>');
                rows_counter ++ ;




            })




        })
    }) ;



        $("#modifyForm input")
            .jqBootstrapValidation({
            preventSubmit: true,
            submitError: function ($form, event, errors) {
                // additional error messages or events
            },
            submitSuccess: function ($form, event) {
                event.preventDefault();
                $("#successmodif").empty();

                var identity_key = $("input#identity_key").val();
                var new_status = $("input#new_status").val();






                require(["validator"], function(validator) {

                if (!validator.isHexadecimal(identity_key) || !validator.isLength(identity_key, {min:32, max: 32}) )
                {
                    $('#successmodif').html("<div class='alert alert-danger'>");
                    $('#successmodif > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                        .append("</button>");
                    $('#successmodif > .alert-danger').append($("<strong>").text("Please Verify Format"));
                    $('#successmodif > .alert-danger').append('</div>');
                    //clear all fields
                    $('#modifyForm').trigger("reset");

                }
                    else if (new_status !== 'activate' && new_status !== 'deactivate'&& new_status !== 'delete')
                    {
                        console.log('diff')
                        $('#successmodif').html("<div class='alert alert-danger'>");
                        $('#successmodif > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                            .append("</button>");
                        $('#successmodif > .alert-danger').append($("<strong>").text("Please Verify Entered Status ('activate'/'deactivate'/'delete')"));
                        $('#successmodif > .alert-danger').append('</div>');
                        //clear all fields
                        $('#modifyForm').trigger("reset");

                    }
                    else
                {


                    requirejs(['modify'], function( modify ) {
                        modify.modify_beacon(identity_key,new_status,function (cipher) {
                            console.log(cipher) ;
                            var url_modification = 'https://beacon-resolution-service.herokuapp.com/modify/deactivate' ;
                            var method = "PUT" ;
                            var secret_json ={
                                deactivation_secret:cipher
                            } ;

                            if (new_status === 'activate')
                            {
                                url_modification = 'https://beacon-resolution-service.herokuapp.com/modify/activate' ;
                                secret_json ={
                                    activation_secret:cipher
                                } ;
                            }



                            else if (new_status === 'delete')
                            {
                                url_modification= 'https://beacon-resolution-service.herokuapp.com/modify/delete' ;
                                method= "DELETE" ;
                                secret_json ={
                                    delete_secret:cipher
                                } ;

                            }

                            $.ajax({
                                url: url_modification,
                                type: method,
                                contentType: "application/x-www-form-urlencoded",

                                data: secret_json,

                                success: function (response) {
                                    console.log(response);
                                    if (response === 'Authentication failed or Beacon already deactivated')
                                    {
                                        $('#successmodif').html("<div class='alert alert-danger'>");
                                        $('#successmodif > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                                            .append("</button>");
                                        $('#successmodif > .alert-danger').append($("<strong>").text("Your Beacon is already deactivated or you entered a wrong ID"));
                                        $('#successmodif > .alert-danger').append('</div>');
                                        //clear all fields
                                        $('#modifyForm').trigger("reset");

                                    }
                                    else if (response === 'Authentication failed or Beacon already activated')
                                    {
                                        $('#successmodif').html("<div class='alert alert-danger'>");
                                        $('#successmodif > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                                            .append("</button>");
                                        $('#successmodif > .alert-danger').append($("<strong>").text("Your Beacon is already activated or you entered a wrong ID"));
                                        $('#successmodif > .alert-danger').append('</div>');
                                        //clear all fields
                                        $('#modifyForm').trigger("reset");

                                    }
                                    else if (response === 'Authentication failed or Beacon not registered')
                                    {
                                        $('#successmodif').html("<div class='alert alert-danger'>");
                                        $('#successmodif > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                                            .append("</button>");
                                        $('#successmodif > .alert-danger').append($("<strong>").text("Your Beacon is not registered or you entered a wrong ID"));
                                        $('#successmodif > .alert-danger').append('</div>');
                                        //clear all fields
                                        $('#modifyForm').trigger("reset");

                                    }
                                    else if (response === 'Beacon deactivated')
                                    {
                                        requirejs(['couchdbManager'], function( Model ) {
                                            Model.update_beacon_status(identity_key,new_status,function (res) {
                                                console.log(res) ;
                                                $('#successmodif').html("<div class='alert alert-success'>");
                                                $('#successmodif > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                                                    .append("</button>");
                                                $('#successmodif > .alert-success').append($("<strong>").text("Beacon Deactivated successfully"));
                                                $('#successmodif > .alert-success').append('</div>');
                                                //clear all fields
                                                $('#modifyForm').trigger("reset");

                                            })
                                        }) ;


                                    }
                                    else if (response === 'Beacon activated')
                                    {
                                        requirejs(['couchdbManager'], function( Model ) {
                                            Model.update_beacon_status(identity_key,new_status,function (res) {
                                                console.log(res) ;
                                                $('#successmodif').html("<div class='alert alert-success'>");
                                                $('#successmodif > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                                                    .append("</button>");
                                                $('#successmodif > .alert-success').append($("<strong>").text("Beacon Activated Successfully"));
                                                $('#successmodif > .alert-success').append('</div>');
                                                //clear all fields
                                                $('#modifyForm').trigger("reset");

                                            })
                                        }) ;


                                    }
                                    else if (response === 'Beacon deleted')
                                    {
                                        requirejs(['couchdbManager'], function( Model ) {
                                            Model.delete_beacon("928545faf6be193efb042f015c00240c",function (res) {
                                                console.log("callback: ",res) ;

                                                $('#successmodif').html("<div class='alert alert-success'>");
                                                $('#successmodif > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                                                    .append("</button>");
                                                $('#successmodif > .alert-success').append($("<strong>").text("Beacon Deleted Successfully"));
                                                $('#successmodif > .alert-success').append('</div>');
                                                //clear all fields
                                                $('#modifyForm').trigger("reset");


                                            })
                                        }) ;





                                    }
                                    else {
                                        $('#successmodif').html("<div class='alert alert-danger'>");
                                        $('#successmodif > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                                            .append("</button>");
                                        $('#successmodif > .alert-danger').append($("<strong>").text("Unhandeled Server Response"));
                                        $('#successmodif > .alert-danger').append('</div>');
                                        //clear all fields
                                        $('#modifyForm').trigger("reset");

                                    }

                                    $('#modifyForm').trigger("reset");

                                },
                                error:function(err) {
                                    console.log(err);
                                    $('#modifyForm').trigger("reset");
                                }
                            }) ;

                        }) ;


                    }) ;

                }


                });

            },
            filter: function () {
                return $(this).is(":visible");
            }
        });








    $('#get_info').unbind('click').bind('click', function () {
        $.ajax
        ({
            type: "GET",
            url: "https://beacon-resolution-service.herokuapp.com/register",
            crossDomain:true,
            contentType: "application/x-www-form-urlencoded",
            success: function (data) {


                    $("#public_key").append('<div class="panel-body">'+ atob(data.public_key)+'</div>') ;
                    $("#rot_min").append('<div class="panel-body">'+data.rotation_period_min+'</div>') ;
                    $("#rot_max").append('<div class="panel-body">'+data.rotation_period_max+'</div>') ;



            },
            error:function () {
                $('#msg_get_params').html("<div class='alert alert-danger'>");
                $('#msg_get_params > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                    .append("</button>");
                $('#msg_get_params > .alert-danger').append($("<strong>").text("Could not get params"));
                $('#msg_get_params > .alert-danger').append('</div>');



            }

            }

        )
    });


        $("#registerForm input,#contactForm textarea").jqBootstrapValidation({
            preventSubmit: true,
            submitError: function ($form, event, errors) {

            },
            submitSuccess: function ($form, event) {

                event.preventDefault() ;
                event.stopPropagation();




                var beacon_private_key = $("input#beacon_private_key").val();
                var beacon_public_key = $("input#beacon_public_key").val();
                var service_public_key = $("input#service_public_key").val();
                var scalar = $("input#scalar").val();
                var beacon_time_seconds = $("input#beacon_time_seconds").val();
                var beacon_initial_time_seconds = $("input#beacon_initial_time_seconds").val();
                var eid = $("input#eid").val();


               // Check for white space in name for Success/Fail message

                $.ajax({
                    url: "https://beacon-resolution-service.herokuapp.com/register",
                    type: "POST",
                    contentType: "application/x-www-form-urlencoded",
                    crossDomain:true,

                    data: {
                        beacon_public_key: beacon_public_key,
                        service_public_key: service_public_key,
                        scalar: scalar,
                        beacon_initial_time_seconds: beacon_initial_time_seconds,
                        beacon_time_seconds: beacon_time_seconds,
                        eid: eid
                    },

                    success: function (response) {


                        console.log(response) ;

                        if (response === 'Not Equal eid') {
                            $('#successRegister').html("<div class='alert alert-danger'>");
                            $('#successRegister > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                                .append("</button>");
                            $('#successRegister > .alert-danger').append($("<strong>").text("Sorry , The server computed EID doesn't match the sent EID, Registration can't be made"));
                            $('#successRegister > .alert-danger').append('</div>');
                            //clear all fields
                            $('#registerForm').trigger("reset");

                        }
                        else if (response === 'Invalid id') {



                            $('#successRegister').html("<div class='alert alert-danger'>");
                            $('#successRegister > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                                .append("</button>");
                            $('#successRegister > .alert-danger').append($("<strong>").text("Sorry , constraint of unique Database ID"));
                            $('#successRegister > .alert-danger').append('</div>');
                            //clear all fields
                            $('#registerForm').trigger("reset");

                        }
                        else if (response === 'Verify sent data') {
                            $('#successRegister').html("<div class='alert alert-danger'>");
                            $('#successRegister > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                                .append("</button>");
                            $('#successRegister > .alert-danger').append($("<strong>").text("Sorry , Please verify sent data formats"));
                            $('#successRegister > .alert-danger').append('</div>');
                            //clear all fields
                            $('#registerForm').trigger("reset");

                        }
                        else if (response === 'Error, null shared secret') {
                            $('#successRegister').html("<div class='alert alert-danger'>");
                            $('#successRegister > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                                .append("</button>");
                            $('#successRegister > .alert-danger').append($("<strong>").text("Sorry , Please verify that ECDH curve is compatible with the server's curve"));
                            $('#successRegister > .alert-danger').append('</div>');
                            //clear all fields
                            $('#registerForm').trigger("reset");

                        }
                        else {



                            get_shared_secret(beacon_private_key,service_public_key,function (AESkey) {

                                console.log(AESkey) ;
                                requirejs(['couchdbManager'], function( Model ) {
                                    Model.save_beacon_database(AESkey, beacon_private_key, beacon_public_key
                                        , beacon_initial_time_seconds, function (msg) {
                                        console.log("msg couchdb",msg) ;

                                            if (msg === 'success') {

                                                $('#successRegister').html("<div class='alert alert-success'>");
                                                $('#successRegister > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                                                    .append("</button>");
                                                $('#successRegister > .alert-success').append($("<strong>").text("Beacon Registered Successfully"));
                                                $('#successRegister > .alert-success').append('</div>');
                                                //clear all fields
                                                $('#registerForm').trigger("reset");

                                            }
                                            else if (msg === 'Error db creation'){

                                                $('#successRegister').html("<div class='alert alert-danger'>");
                                                $('#successRegister > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                                                    .append("</button>");
                                                $('#successRegister > .alert-danger').append($("<strong>").text("Error saving to database"));
                                                $('#successRegister > .alert-danger').append('</div>');
                                                //clear all fields
                                                $('#registerForm').trigger("reset");


                                            }



                                        }) ;
                                });



                            }) ;




                        }

                    },
                    error: function (res) {

                        console.log(res) ;


                        $('#successRegister').html("<div class='alert alert-danger'>");
                        $('#successRegister > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                            .append("</button>");
                        $('#successRegister > .alert-danger').append($("<strong>").text("Sorry , unknown error"));
                        $('#successRegister > .alert-danger').append('</div>');
                        //clear all fields
                        $('#registerForm').trigger("reset");


                    },
                });
            },
            filter: function () {
                return $(this).is(":visible");
            },
        });


        $('#portfolioModal1').on('hidden.bs.modal', function () {


            $("#info").empty();
            $("#successRegister").empty();
            $("#msg_get_params").empty();
            $("#panel_parms").empty();
        })




    });











