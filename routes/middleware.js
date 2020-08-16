const jwt = require('jsonwebtoken');
const secret = 'hello';
const userDAO = require("../daos/user");


module.exports.verifyEmailAndPassword = (req, res, next) => {
    console.log(`${req.method} login${req.path}`);
    const { email, password } = req.body;
    if (!email) {
        res.status(400).send("Email is required for login");
    } else if (!password) {
        res.status(400).send("Password is required for login");
    } else {
        next();
    }
}

module.exports.isAuthorized = (req, res, next) => {
    const {authorization} = req.headers;
    if (authorization) {
      const authToken = authorization.toString().split('Bearer ')[1]
      if (authToken && authToken !== "undefined") {
        try {
          const user = jwt.verify(authToken, secret)
          if(user) {
              console.log("You are authorized")
              req.user = user;
              next();
          } else {
              res.status(401).send("Not authorized")
          }
          
        } catch (e) {
          res.status(401).send("Please login to your account");
        }
      }
    } else {
      res.status(401).send("Please login or create an account first");
    }
}

module.exports.isAdmin = (req, res, next) => {
    const { roles } = req.user;
    if(roles.includes('admin')) {
        next();
    } else {
        res.status(403).send("Admin role is required")
    }
}