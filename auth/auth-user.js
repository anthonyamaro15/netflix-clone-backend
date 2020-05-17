const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/secret");

const User = require("../user-schema/user-model");

const route = express.Router();

// Register a user /api/auth/register
route.post("/register", (req, res) => {
  const userInfo = req.body;
  const { email } = req.body;

  User.findBy({ email }).then((user) => {
    if (user) {
      res.status(500).json({ message: "Email already taken" });
    } else {
      const hash = bcrypt.hashSync(userInfo.password, 8);
      userInfo.password = hash;
      User.add(userInfo)
        .then((user) => {
          res.status(201).json(user);
        })
        .catch(({ error, message }) => {
          res.status(400).json({ error, message });
        });
    }
  });
});

// Log ing user /api/auth/login
route.post("/login", (req, res) => {
  const { email, password } = req.body;

  User.findBy({ email })
    .then((user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({
          username: user.username,
          token,
        });
      } else {
        res.status(401).json({ message: "Invalid email or password" });
      }
    })
    .catch(({ error, message }) => {
      res.status(500).json({ error, message });
    });
});

function generateToken(user) {
  const payload = {
    user: user.username,
  };
  const options = {
    expiresIn: "1h",
  };
  return jwt.sign(payload, jwtSecret, options);
}

module.exports = route;
