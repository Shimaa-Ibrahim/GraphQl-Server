const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const User = require("../models/user");
const throwError = require('./error');

exports.register = async ({ userInput: { name, email, password } }) => {
  const errs = [];
  if (!validator.isEmail(email)) errs.push("Invalid Email!");
  if (validator.isEmpty(password) || !validator.isLength(password, { min: 5 })) {
    errs.push("Password is too short!");
  }
  if (errs.length > 0) throwError("Invalid input!", 422, errs);

  const existUser = await User.findOne({ email: email });
  if (existUser) throwError("User already exists!", 401);
  const hash = await bcrypt.hash(password, 12);
  const user = new User({
    name,
    email,
    password: hash
  });

  const createdUser = await user.save();
  return createdUser;
}


exports.login = async ({ credentials: { email, password } }) => {
  const user = await User.findOne({ email: email });
  if (!user) throwError("User not found!", 401); throwError("Invalid Credentials!", 401);
  const pass = await bcrypt.compare(password, user.password);
  if (!pass) throwError("Invalid Credentials!", 401);

  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1h" }
  );
  return {
    token,
    userId: user._id
  }

}