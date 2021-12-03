const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const dotenv = require('dotenv');
const redis = require("redis");
const {promisify} = require("util");
const User = require("../models/user");
const throwError = require('./error');

dotenv.config();
const redisClient = redis.createClient ({
  host: process.env.REDIS_URL,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
});

redisClient.on('connect', function () {
  console.log('Connected to Redis client');
});

redisClient.on('error', err => {
  console.log('Redis client error: ' + err);
});

redisClient.set = promisify(redisClient.set);
redisClient.get = promisify(redisClient.get);

function createJWTToken(id, secertKey, expirationDate) {
  const token = jwt.sign(
    {
      userId: id,
    },
    secertKey,
    { expiresIn: expirationDate }
  );

  return token;
}

exports.register = async ({ userInput: { name, email, password } }) => {
  const errs = [];
  if (!validator.isEmail(email)) errs.push("Invalid Email!");
  const existUser = await User.findOne({ email: email });
  if (existUser) throwError("User already exists!", 401);
  if (validator.isEmpty(password) || !validator.isLength(password, { min: 5 })) {
    errs.push("Password is too short!");
  }
  if (errs.length > 0) throwError("Invalid input!", 422, errs);

  
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
  if (!user) throwError("User not found!", 401);
  const pass = await bcrypt.compare(password, user.password);
  if (!pass) throwError("Invalid Credentials!", 401);

  const token = createJWTToken(user._id, process.env.JWT_SECRET_KEY, "1h");
  const refreshToken = createJWTToken(user._id, process.env.JWT_REFERESH_KEY, "24h");
  userId = JSON.stringify(user._id);
  try{
    await redisClient.set(refreshToken,userId,'EX', 60*60*24);
  }catch(err){
    throwError("Error ocurred!", 500)
  }
  
  return {
    token,
    refreshToken,
    userId: user._id
  }

}

exports.refreshToken = async ({ refreshToken }) => {
  let userId;
  try{
    userId = await redisClient.get(refreshToken);
  }catch(err){
    throwError("Error ocurred!", 500)
  }

  if (!userId) throwError("Token expired!", 401);
  const token = createJWTToken(userId, process.env.JWT_SECRET_KEY, "1h");
  return {
    token
  }
}

exports.logout = async ({ refreshToken }) => {
  redisClient.del(refreshToken, (err) => {if(err) throwError("Error occured!", 500)});
  return "logout successfully";  
}