/**
 * Created by SPEED on 9/10/2016.
 */
var mongoose = require('mongoose');
var blogSchema = new mongoose.Schema({
    title:  String,
    author: String,
    body:   String,
    comments: [{ author: String, body: String, date: Date }],
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    meta: { votes: Number, favs:  Number }
});
module.exports = mongoose.model('Blog', blogSchema);