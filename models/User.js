var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: String,
    email: String,
    password: String,
    activities: [
        {type: Schema.Types.ObjectId, ref: 'Money'}
    ]
});

var User = mongoose.model('User', UserSchema);

module.exports = User;