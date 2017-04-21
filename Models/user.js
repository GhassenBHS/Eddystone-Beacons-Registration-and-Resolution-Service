/**
 * Created by SPEED on 9/10/2016.
 */
var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    name: String,
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    admin: Boolean,
    location: String,
    meta: {age: Number, website: String},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

userSchema.methods.sayHello = function() {
    return 'Hello' + this.name + '!';
};
userSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at)
        this.created_at = currentDate;
    next();
});


module.exports = mongoose.model('User', userSchema);