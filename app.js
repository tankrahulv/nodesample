const express = require("express");
const bodyParser = require("body-parser");
const app = express(); 
const db = require("./db/index.js");

db.connect().then(() => {
  console.log("DB connected!!!");
});

var http = require("http");

app.use(bodyParser.json());
const PORT = process.env.PORT || 5000;

// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization ,Accept');

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );

  // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization ,Accept');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

// authentication

// API ROUTES -------------------

// get an instance of the router for api routes
var apiRoutes = express.Router();

// route middleware to verify a token
apiRoutes.use(function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers.authorization;
  // decode token
  if (token) {
    token = token.split(" ")[1];
    // verifies secret and checks exp
    jwt.verify(token, app.get("superSecret"), function (err, decoded) {
      if (err) {
        return res.json({
          success: 0,
          message: "Failed to authenticate token.",
        });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
      success: 0,
      message: "No token provided.",
    });
  }
});

app.use("/api", apiRoutes);

/*-----------------------All Routes List---------------------------------*/

var userroute = require("./routes/userroute");

/*---------------------------User Routes------------------------------*/
app.post("/api/user/addUser", userroute.addUser);
app.post("/api/user/updateUserById/:id", userroute.updateUserById);
app.post("/api/user/removeUserById/:id", userroute.removeUserById);
app.get("/api/user/getUserByEmail/:email", userroute.getUserByEmail);
app.get("/api/user/getUsers", userroute.getUsers);
app.post("/user/getUserToken", userroute.getUserToken);

http.createServer(app).listen(PORT, function () {
  console.log("Express server listening on port " + PORT);
});
