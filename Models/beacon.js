var mongoose = require('mongoose');
var beaconSchema = new mongoose.Schema({
    _id: String ,
    rotation_period: {type: String, required: true},
    beacon_initial_time_seconds: {type: String, required: true},
    eid: {type: String, required: true},
    pastEID : [],
    futureEID : [],
    active: {type: Boolean, required: true},
    deactivation_secret: {type: String, required: true},
    activation_secret: {type: String, required: true},
    delete_secret: {type: String, required: true},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});


beaconSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at)
        this.created_at = currentDate;
    next();
});


module.exports = mongoose.model('User', beaconSchema);