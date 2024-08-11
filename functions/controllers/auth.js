require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let mailFunctions = require('./mail');

const login = async (req, res) => {
  let { email, password } = req.query;
  email = req.query.email.toLowerCase();
  const user = await User.findOne({ "contactDetails.email": email });
  if (user) {
    if (await bcrypt.compare(password, user.password)) {
      try {
        const token = jwt.sign(
          JSON.stringify(user),
          process.env.ACCESS_TOKEN_SECRET
        );
        res.send({ msg: "Logged In Successfully!", token: token, user });
      } catch (error) {
        console.log(error);
        res.status(500).send({ msg: "Authentication Failed" });
      }
    } else {
      res.status(401).send({ msg: "Incorrect Credentials!" });
    }
  } else {
    res.status(404).send({ msg: "User Not Found" });
  }
};

const signUp = async (req, res) => {
  req.body.contactDetails.email = req.body?.contactDetails?.email.toLowerCase();
  const query = { "contactDetails.email": req.body?.contactDetails?.email };

  const user = await User.findOne(query);
  if (user) {
    try {
      res.status(409).send({ msg: "User Exists Please Login!" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ msg: "Error Fetching User Details, Try Again Later" });
    }
  } else {
    await hashPassword(req, res).then(() => {
      User.create(req.body).then((user) => {
        if (user) {
          res
            .status(200)
            .send({ msg: "Registered Successfully", user: user[0] });
        } else {
          res
            .status(500)
            .send({ msg: "Error Creating User Details, Try Again Later" });
        }
      });
    });
  }
};

const forgotPassword = async (req, res) => {
  req.body.email = req.body?.email.toLowerCase();
  const query = { "contactDetails.email": req.body?.email };

  try {
    const user = await User.findOne(query);
    if (!user) throw new Error('User not found');
    req.body._password = generatePassword();
    req.body.password = await bcrypt.hash(req.body._password, 10);
    console.log(req.body);
    const updatedUser = await User.findOneAndUpdate(query, { $set: { password:  req.body.password} }, { new: true, returnOriginal: false });
    if (updatedUser) {
      console.log(updatedUser);
      mailFunctions.sendMail(req, res);
      res.status(200).send({ msg: 'Request successful, please check your emails' });
    }
  } catch (error) {
    res.status(404).send({ msg: error.message })
  }
};
const resetPassword = async (req, res) => {
  console.log(req.body);
  let { password, currentPassword, email } = req.body;
  email = req.body?.email.toLowerCase();
  const query = { "contactDetails.email": email };
  try {
    const user = await User.findOne(query);
    if (!await bcrypt.compare(currentPassword, user.password)) {
      throw new Error('Current Password does not match the password for this account');
    }
    if (!user) throw new Error('User not found');

    const updatedPassword = await User.findOneAndUpdate(query, { $set: { password: await bcrypt.hash(password, 10)} }, { new: true, returnOriginal: false });
    if (updatedPassword) {
      res.status(200).send({ msg: 'Password reset successful' });
    }
  } catch (error) {
    console.log(error)
    res.status(404).send({ msg: error.message })
  }
};

const hashPassword = async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    return;
  } catch (error) {
    console.log(error);
    res.send({ msg: "Error hashing password" }).sendStatus(500);
  }
};

const crypto = require('crypto');

const generatePassword = (length = 8) => {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < length; ++i) {
    password += characters[crypto.randomInt(0, characters.length)];
  }
  return password;
}

router.post("/register", signUp);
router.get("/login", login);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);
module.exports = router;
