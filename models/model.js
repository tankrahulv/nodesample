var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema;

//Collection user
var user = new Schema({
	name: String,
	username: String,
	email: String,
	type: String, 
	ip: String,
	userId: String,
}, { collection: 'user' });
exports.user = mongoose.model('user', user);

