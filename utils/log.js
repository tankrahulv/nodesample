var model = require("../models/model");
var USER_COLLECTION = model.user;

module.exports = {
  async saveRequest(type, ip, userId) {
    var user = new USER_COLLECTION({
      type: type,
      ip: ip,
      userId: userId,
    });

    await user.save(function (error, user) {});
  },
};
