const express = require("express");
const bodyParser = require("body-parser");
const app = express(); 
const db = require("./db/index.js");   
var http = require("http");
const { apiResponse } = require('./utils/common');
const { chkToken, setHeader } = require('./utils/auth-token');
const { API_URLS } = require('./constants'); 
app.use(bodyParser.json());
const PORT = process.env.PORT || 5000;

// get an instance of the router for api routes
var apiRoutes = express.Router();

// Add headers
app.use(setHeader); 

// route middleware to verify a token
apiRoutes.use(chkToken);

app.use("/api", apiRoutes);

/*-----------------------All Routes List---------------------------------*/
const { updateUserPhone, getUsers, getUserToken } = require("./routes/userroute");

/*---------------------------User Routes------------------------------*/ 
app.get(API_URLS.PHONE_DATA_UPDATE, async (req, res) => {
  const { phone, userId } = req.query;
  return apiResponse(await updateUserPhone(phone, userId), res);
});
app.get(API_URLS.GET_USERS, getUsers);
app.post(API_URLS.GET_USER_TOKEN, getUserToken);  


// Server and Database connect
http.createServer(app).listen(PORT, function () {
  console.log("Express server listening on port " + PORT);
  db.connect().then(() => {
    console.log("DB connected!!!");
  });
});
