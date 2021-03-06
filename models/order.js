var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    cart: {type: Object, required: true},
    addresses: {type: String, required: true},
    payment: {type: String, required: true},
});

module.exports = mongoose.model('Order', schema);