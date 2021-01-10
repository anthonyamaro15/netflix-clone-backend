const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../user-schema/user-model");
const { sendEmail } = require('../emailHelperFunctions');
const { 
   resetPasswordSecret, 
   rounds 
} = require('../envVariables');

const route = express.Router();


route.patch("/forgotpassword", (req, res) => {
  const { email } = req.body;

  Admin.findBy({ email })
    .then((admin) => {
      if (!admin) {
        res.status(404).json({ errorMessage: "Invalid email" });
      } else {
        const token = jwt.sign({ admin: admin.email }, resetPasswordSecret, {
          expiresIn: "10m",
        });

        const id = admin.id;

        try {
         Admin.update(id, { reset_link: token }).then((adm) => {
            sendEmail({ email, token, admin });
            res.status(200).json({ message: "Reset link has been sent." });
         });           
        } catch (error) {
           res.status(500).json({ errorMessage: error.message });
        }
      }
    })
    .catch((err) => {
      res.status(500).json({
        errorMessage: "Something went wrong with the server",
        error: err.message,
      });
    });
});

route.patch("/resetpassword/:token", (req, res) => {
  const reset_link = req.params.token;
  let credentials = req.body;

  if (reset_link) {
    jwt.verify(reset_link, resetPasswordSecret, (error, decodedToken) => {
      if (error) {
        res
          .status(401)
          .json({ errorMessage: "Incorrect token or it is expired." });
      }
    });
  }

  Admin.findBy({ reset_link })
    .then((link) => {
      if (!link) {
        res
          .status(400)
          .json({ errorMessage: "Admin with this token does not exist." });
      }

      const hash = bcrypt.hashSync(credentials.password, rounds);
      credentials.password = hash;

      const id = link.id;

      const newCredentials = {
        password: credentials.password,
        reset_link: "",
      };

      Admin.update(id, newCredentials)
        .then(() =>
          res
            .status(200)
            .json({ message: "Password has been updated successfully" })
        )
        .catch((err) =>
          res.status(500).json({
            errorMessage: err.message,
          })
        );
    })
    .catch((err) => {
      res.status(500).json({
        errorMessage: "There was an error finding admin",
        error: err.message,
      });
    });
});

module.exports = route;
