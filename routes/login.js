const { Router } = require("express");
const router = Router();
const jwt = require('jsonwebtoken');
const secret = "hello";
const bcrypt = require('bcrypt');
const middleware = require('./middleware');
const userDAO = require("../daos/user");
const saltRounds = 10;

//-------------- Middleware Functions -----------------//

router.use(middleware.verifyEmailAndPassword);

//-------------- Route Endpoints -----------------//

//Set up this route for debugging purposes
router.get("/", async (req, res, next) => {
    const allUsers = await userDAO.findAll();
    if(allUsers) {
        res.json(allUsers);
    } else {
        res.status(500).send("Oops, server error!")
    }
})

// Logs in a user "POST /login"
router.post("/", async (req, res, next) => {
    const {email, password } = req.body;
    try {
        const user = await userDAO.findByEmail(email);
        const data = { email: user.email, _id: user._id, roles: user.roles };
        if(!user){
            res.status(401).send(`User with email ${email} does not exist`);
        } else if (!bcrypt.compareSync(password, user.password)) {
            res.status(401).send("Passwords do not match");
        }else {
            const token = jwt.sign(data, secret, { expiresIn: '1 day' })
            res.body = {token: token};
            res.json(res.body);
        }
    } catch(err) {
        res.status(401).send("Please create an account first");
    }
    
})

// Creates a new user "POST /login/signup"
router.post("/signup", async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).send("Email and password required");
    } else {
        try {
            const user = await userDAO.findByEmail(email);
            if(user) {
                res.status(409).send("User registered with this email already exists");
            } else {
                const newUser = await userDAO.createUser(req.body);
                res.json(newUser);
            }
        }
        catch(err) {
            res.status(500).send("Oops, server error! " + err.message)
        }
    }
})

// Allows user to change password "POST /login/password"
router.post("/password", middleware.isAuthorized, async (req, res, next) => {
    if (req.email) {
        try {
          const {password} = req.body;
          if (!password) {
            res.status(401).send('Please provide a new password');
          } else {
            const updatedUser = await userDAO.changePassword(req.email, password)
            res.json(updatedUser);
          }
        } catch (e) {
          res.status(401).send(e.message);
        }
    } else {
        res.status(401).send('Please login or sign up for an account');
    }
})


module.exports = router;



