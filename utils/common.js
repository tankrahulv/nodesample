const { RESPONSE_STATUS, MESSAGES } = require("../constants");
const client = require('twilio')(accountSid, authToken);

const updatePhoneData = async (orgID) =>
  new Promise(async (resolve, reject) => {
    try {
      let phoneData = null;
      let phoneObject = "";
      var query = { org_id: orgID };
      const { rows } = await USER_COLLECTION.find(query); 
      const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/; 
      for (let i = 0; i < rows.length; i++) {
        phoneObject = rows[i].resource.telecom.find(
          (telecomObject) =>
            telecomObject.system &&
            telecomObject.system.toLowerCase() === "phone"
        );
        if (phoneRegex.test(subjectString)) {
          subjectString.replace(phoneRegex, "($1) $2-$3");
          try {
            phoneData = await checkPhone(phoneObject.value);
          } catch (e) {
            phoneData = {
              status: RESPONSE_STATUS.FAIL,
              message: e.message,
            };
          }
        } else {
          phoneData = { status: RESPONSE_STATUS.FAIL };
        } 
      }

      resolve({
        status: RESPONSE_STATUS.SUCCESS,
        message: MESSAGES.PATIENT.REGISTRED,
        data: null,
      });
    } catch (e) {
      reject(e);
    }
  });

  
const checkPhone = async phoneNumber => new Promise(async (resolve, reject) => {
    try {
      const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        if (phoneRegex.test(phoneNumber)) {
          client.lookups.phoneNumbers(phoneNumber)
          .fetch({ type: ['carrier'] })
          .then(phone_number => resolve({
            status: RESPONSE_STATUS.SUCCESS,
            data: phone_number,
          }))
          .catch(error => reject(error));
        } else {
          const responseData = {
            status: RESPONSE_STATUS.FAIL,
          };
          reject(responseData);
        }
        } catch (error) {
          const responseData = {
            status: RESPONSE_STATUS.FAIL,
            message: error.message,
          };
          reject(responseData);
    }
  });
  
const apiResponse = async ({ status, data, message }, res) => {
  try {
    let id = "";
    let statusCode = "";
    let statusMSG = "";
    if (res.locals.tokenData !== undefined) {
      // eslint-disable-next-line prefer-destructuring
      id = res.locals.tokenData.id;
    }
    if (status === RESPONSE_STATUS.FAIL) {
      statusCode = 400;
      statusMSG = message;
    } else if (status === RESPONSE_STATUS.UNAUTHORIZED) {
      statusCode = 401;
      statusMSG = message;
    } else if (status === RESPONSE_STATUS.ERROR) {
      statusCode = 500;
      statusMSG = message;
    } else if (status === RESPONSE_STATUS.BAD_REQUEST) {
      statusCode = 400;
      statusMSG = message;
    } else if (status === RESPONSE_STATUS.SUCCESS) {
      statusCode = 200;
      statusMSG = RESPONSE_STATUS.SUCCESS;
    }
  } catch (e) {
    return { status: RESPONSE_STATUS.FAIL, message: e.message };
  } finally {
    if (status === RESPONSE_STATUS.FAIL) {
      return res.status(400).json({
        status,
        message,
        data,
      });
    }
    if (status === RESPONSE_STATUS.UNAUTHORIZED) {
      return res.status(401).json({
        status,
        message,
        data,
      });
    }
    if (status === RESPONSE_STATUS.ERROR) {
      return res.status(500).json({
        status,
        message,
        data,
      });
    }
    if (status === RESPONSE_STATUS.BAD_REQUEST) {
      return res.status(400).json({
        status,
        message,
        data,
      });
    }
    return res.status(200).json({
      status,
      data,
      message,
    });
  }
};

module.exports = {
  updatePhoneData,
  apiResponse,
};
