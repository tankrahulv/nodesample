var model = require('../models/model');
var USER_COLLECTION = model.user;
var json = {};
var ObjectID = require('mongodb').ObjectID;
var jwt = require('jsonwebtoken');
var constant = require('../config/constant.json');

/*-------------------------------------------------------*/
exports.addUser = _addUser;
exports.getUserByEmail = _getUserByEmail;
exports.getUsers = _getUsers;
exports.updateUserById = _updateUserById;
exports.removeUserById = _removeUserById;
exports.getUserToken = _getUserToken;
/*-------------------------------------------------------*/

/*
TODO:To add new user.
*/
function _addUser(req, res, next) {
	var name = req.body.name;
	var email = req.body.email;
	var type = req.body.type;

	var user = new USER_COLLECTION({
		name: name,
		email: email,
		type: type
	});

	var json = {};
	var query = { email: email };
	USER_COLLECTION.find(query, function (usererror, getUser) {
		if (usererror || getUser.length > 0) {
			json.status = '0';
			json.result = { 'Message': 'User Already Exists' };
			res.send(json);
		} else {
			user.save(function (error, user) {
				if (error) {
					json.status = '0';
					json.result = { 'error': 'Error In Adding New User' };
					res.send(json);
				} else {
					json.status = '1';
					json.result = { 'Message': 'User Added Successfully' };
					res.send(json);
				}
			});
		}
	});
}

/*
TODO: POST To Update User By Id
*/
function _updateUserById(req, res, next) {
	var user_id = req.params.id;
	var email = req.body.email;
	var name = req.body.name;
	var type = req.body.type;

	var query = {
		$set: {
			name: name,
			email: email,
			type: type
		}
	};

	USER_COLLECTION.find({ email: email }, function (usererror, getUser) {
		if (usererror || (getUser.length > 0 && getUser[0]._id != user_id)) {
			json.status = '0';
			json.result = { 'Message': 'User Already Exists' };
			res.send(json);
		} else {
			USER_COLLECTION.update({ _id: new ObjectID(user_id) }, query, function (error, result) {
				if (error) {
					json.status = '0';
					json.result = { 'error': 'Error In Updating New User' };
					res.send(json);
				} else {
					json.status = '1';
					json.result = { 'Message': 'User Updated Successfully' };
					res.send(json);
				}
			});
		}
	});
}


/*
TODO: POST To Remove User By Id
*/
function _removeUserById(req, res, next) {
	var user_id = req.params.id;
	USER_COLLECTION.deleteOne({ _id: new ObjectID(user_id) }, function (error, result) {
		if (error) {
			json.status = '0';
			json.result = { 'error': 'Error In Removing New User' };
			res.send(json);
		} else {
			json.status = '1';
			json.result = { 'Message': 'User Removed Successfully' };
			res.send(json);
		}
	});
}


/*
TODO:To get user by Email.
*/
function _getUserByEmail(req, res, next) {
	var email = req.params.email;
	var query = { "email": email };
	USER_COLLECTION.find(query, function (usererror, getUser) {
		if (usererror || getUser.length <= 0) {
			json.status = '0';
			json.result = { 'Message': 'Users Not Found' };
			res.send(json);
		} else {
			json.status = '1';
			json.result = getUser;
			res.send(json);
		}
	});
}

/*
TODO:To Get User Token
*/
function _getUserToken(req, res, next) {
	var email = req.body.email;
	var query = { "email": email };
	USER_COLLECTION.findOne(query, function (usererror, getUser) {
		if (usererror) {
			json.status = '0';
			json.result = { 'Message': 'Users Not Found' };
			res.send(json);
		} else {
			var token = jwt.sign(getUser, constant.superSecret, {
				expiresIn: 86400 // expires in 24 hours
			});
			json.status = '1';
			json.result = {"user": getUser, "token": 'Basic ' + token};
			res.send(json);
		}
	});
}


/*
TODO:To get users.
*/

function _getUsers(req, res, next) {
	var query = {};
	USER_COLLECTION.find(query, function (usererror, users) {
		if (usererror || users.length <= 0) {
			json.status = '0';
			json.result = { 'Message': 'User Not Found' };
			res.send(json);
		} else {
			json.status = '1';
			json.result = users;
			res.send(json);
		}
	});
}

