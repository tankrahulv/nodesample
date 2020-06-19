var model = require("../models/model");
var USER_COLLECTION = model.user;
var json = {};
var jwt = require("jsonwebtoken");
var constant = require("../config/constant.json");
var { updatePhoneData, apiResponse } = require("../utils/common");
var { RESPONSE_STATUS,MESSAGES } = require("../constants");
 
/*
TODO:To Get User Token
*/
const getUserToken = async (req, res) => {
  try {
    const { email } = req.body;
    const responseData = await userToken(email);
    return apiResponse(responseData, res);
  } catch (e) {
    const responseData = {
      status: RESPONSE_STATUS.FAIL,
      message: e.message,
    };
    return apiResponse(responseData, res);
  }
};

const userToken = async (email) =>
  new Promise(async (resolve, reject) => {
    try {
		var query = { "email": email };
      USER_COLLECTION.findOne(query, function (usererror, getUser) {
        if (usererror) {
          const responseData = {
			status: RESPONSE_STATUS.FAIL,
			message: MESSAGES.USER.NO_USER_FOUND
          };
          reject(responseData);
        } else {
          var token = jwt.sign(getUser, constant.superSecret, {
            expiresIn: 86400, // expires in 24 hours
          });
          resolve({
            status: RESPONSE_STATUS.SUCCESS,
            result: { user: getUser, token: "Basic " + token },
          });
        }
      });
    } catch (error) {
      const responseData = {
        status: RESPONSE_STATUS.FAIL,
        message: error.message,
      };
      reject(responseData);
    }
  });

/*
  TODO:To get users.
  */

const getUsers = async (req, res) => 
new Promise(async (resolve, reject) => {
    try {
		var query = { };
      USER_COLLECTION.find(query, function (usererror, users) {
        if (usererror || users.length <= 0) {
          const responseData = {
			status: RESPONSE_STATUS.FAIL,
			message: MESSAGES.USER.NO_USER_FOUND
          };
          reject(responseData);
        } else { 
          resolve({
            status: RESPONSE_STATUS.SUCCESS,
            result: users,
          });
        }
      });
    } catch (error) {
      const responseData = {
        status: RESPONSE_STATUS.FAIL,
        message: error.message,
      };
      reject(responseData);
    }
  }); 

const updateUserPhone = async (req, res) => {
  try {
    const { orgID } = req.query;
    const responseData = await updatePhoneData(orgID);
    return apiResponse(responseData, res);
  } catch (e) {
    const responseData = {
      status: RESPONSE_STATUS.FAIL,
      message: e.message,
    };
    return apiResponse(responseData, res);
  }
};



module.exports = {
	updateUserPhone,
	getUsers,
	getUserToken,
  };
  
