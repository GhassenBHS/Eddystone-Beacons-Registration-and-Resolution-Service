/**
 * Created by ghassen on 12/05/17.
 */
define(function () {

    return {

    save_beacon_database : function (AESkey, beacon_private_key, beacon_public_key, beacon_initial_time_seconds,callback) {

        $.couch.urlPrefix = "http://localhost:5984";

        $.couch.allDbs({
            success: function(data) {
                var doc = {
                    _id: AESkey,
                    beacon_private_key: beacon_private_key,
                    beacon_public_key:beacon_public_key,
                    beacon_initial_time_seconds: beacon_initial_time_seconds,
                    status: "Active",
                    registration_time: new Date().getTime()

                } ;

                if (!data.includes('beacons'))
                {
                    $.couch.db("beacons").create({
                        success: function(data) {
                            console.log(data);
                            $.couch.db("beacons").saveDoc(doc, {
                                success: function(data) {
                                    console.log(data);
                                    callback('success')
                                },
                                error: function(status) {

                                    console.log(status);
                                }
                            });

                        },
                        error: function(status) {
                            console.log(status);
                            callback('Error db creation') ;
                        }
                    });
                }
                else
                {
                    $.couch.db("beacons").saveDoc(doc, {
                        success: function(data) {
                            console.log(data);
                            callback('success')
                        },
                        error: function(status) {
                            console.log(status) ;
                        }
                    });

                }





            }
        });

    } ,
        bind_beacons_list : function (callback) {

            $.couch.urlPrefix = "http://localhost:5984";
            $.couch.db("beacons").allDocs({
                success: function(data) {
                    var docs=data.rows ;
                    var len=docs.length ;
                    var beacon= {} ;
                    var list_beacons = [] ;
                    var beacons_count=0 ;
                    // console.log(data.rows[0].key) ;
                    $.each(docs, function(index,value) {
                        var beacon= {} ;
                        $.couch.db("beacons").openDoc(value.id, {

                            success: function(dok) {


                                beacon ={

                                    SharedSecret:dok._id ,
                                    InitialTime: dok.beacon_initial_time_seconds,
                                    Status: dok.status,
                                    RegistrationTime: dok.registration_time
                                } ;
                                list_beacons[beacons_count]=beacon ;
                                beacons_count++ ;
                                if (beacons_count === len)
                                {
                                    callback(list_beacons) ;
                                }


                            },
                            error: function() {
                                callback('Database ERROR') ;

                            }
                        });


                    });






                }
            });



        },

        delete_beacon: function (ik,callback) {
            $.couch.urlPrefix = "http://localhost:5984";


            $.couch.db("beacons").openDoc(ik, {
                success: function(doc) {
                    console.log(doc);


                    $.couch.db("beacons").removeDoc(doc, {
                        success: function(data) {
                            console.log(data);
                            callback('deleted couchdb') ;
                        },
                        error: function(status) {
                            console.log(status);
                            callback('error while delete couchdb') ;
                        }
                    });

                },
                error: function(status) {
                    console.log(status);
                    callback('error while delete couchdb') ;
                }
            });



        },
        update_beacon_status: function (ik,new_status,callback) {
            $.couch.urlPrefix = "http://localhost:5984";
            var status = (new_status === 'deactivate')?'Inactive':'Active' ;


            $.couch.db("beacons").openDoc(ik, {
                success: function(doc) {
                    console.log(doc);
                    doc.status = status;

                    $.couch.db("beacons").saveDoc(doc, {
                        success: function(data) {
                            callback('status modified') ;
                        },
                        error: function(status) {
                            console.log(status);
                        }
                    });




                },
                error: function(status) {
                    console.log(status);
                    callback('error while status modification couchdb') ;
                }
            });



        }

    }



}) ;




