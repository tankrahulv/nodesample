const chkToken = async (req, res, next) => { 

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

}

const setHeader = async (req, res, next) => { 
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
}

module.exports = {
    chkToken,
    setHeader
}