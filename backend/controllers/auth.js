const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../models/user");

exports.register = async ({ userInput: { name, email, password } }) => {
  const errs = [];
  if (!validator.isEmail(email)) errs.push("Invalid Email!");
  if (validator.isEmpty(password) || !validator.isLength(password, { min: 5 })) {
    errs.push("Password is too short!");
  }
  if (errs.length > 0) {
    const err = new Error("Invalid input");
    err.data = errs;
    err.code = 422;
    throw err;
  }

  const existUser = await User.findOne({ email: email });
  if (existUser) throw new error("User already exists!");
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
  if (!user) {
    const err = new Error("User not found!");
    err.code = 401;
    throw err;
  }

  const pass = await bcrypt.compare(password, user.password);
  if (!pass) {
    const err = new Error("Invalid Credentials!");
    err.code = 401;
    throw err;
  }

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