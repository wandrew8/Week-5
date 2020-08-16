const User = require('../models/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {};

module.exports.findAll = () => {
    return User.find({});
}

module.exports.createUser = async (userData) => {
    userData.password = bcrypt.hashSync(userData.password, saltRounds);
    userData.roles = ['user'];
    return newUser = await User.create(userData);
  }

module.exports.findByEmail = (email) => {
    return User.findOne({ email }).lean();
}

module.exports.changePassword = (email, password) => {
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    return User.updateOne({ email: email }, {$set: {password: hashedPassword}});
}