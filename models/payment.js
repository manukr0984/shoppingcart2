var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    cardName: {type: String, required: true},
    cardNumber: {type: String, required: true},
    expMonth: {type: String, required: true},
    expYear: {type: String, required: true},
    cvc: {type: String, required: true},
});

module.exports = mongoose.model('Payment', schema);