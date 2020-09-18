const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Admin = require("../user-schema/user-model");
const resetTemplate = require("../templates/resetTemplate");

const route = express.Router();

route.patch("/forgotpassword", (req, res) => {
  const { email } = req.body;

  Admin.findBy({ email })
    .then((admin) => {
      console.log("what is this? ", admin);
      if (!admin) {
        res.status(404).json({ errorMessage: "Invalid email" });
      } else {
        const token = jwt.sign({ admin: admin.email }, process.env.RESET_PASS, {
          expiresIn: "10m",
        });

        const id = admin.id;

        Admin.update(id, { reset_link: token }).then((adm) => {
          async function main() {
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
              service: "Gmail",
              auth: {
                user: process.env.GMAIL_USER, // generated ethereal user
                pass: process.env.GMAIL_PASS, // generated ethereal password
              },
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
              from: `TMovies <${process.env.GMAIL_USER}>`, // sender address
              to: email, // list of receivers
              subject: "Reset Password", // Subject line
              html: resetTemplate(token, admin), // html body
            });

            console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
          }
          main();
          res.status(200).json({ message: "Reset link has been sent." });
        });
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
    jwt.verify(reset_link, process.env.RESET_PASS, (error, decodedToken) => {
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

      const hash = bcrypt.hashSync(
        credentials.password,
        Number(process.env.ROUNDS)
      );
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
