var mongoose = require('mongoose');
var beaconSchema = new mongoose.Schema({
    identity_key: {type: String, required: true, unique: true},
    rotation_period: {type: String, required: true},
    beacon_time_seconds: {type: String, required: true},
    eid: {type: String, required: true},
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