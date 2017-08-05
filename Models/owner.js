/**
 * Created by ghassen on 28/07/17.
 */
var mongoose = require('mongoose');
var ownerSchema = new mongoose.Schema({
    id: String,
    access_token: String,
    firstName: String,
    lastName: String,
    email: String,
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});



module.exports = mongoose.model('Owner', ownerSchema);