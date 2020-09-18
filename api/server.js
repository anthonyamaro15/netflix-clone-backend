const express = require("express");
const cors = require("cors");

const authUser = require("../auth/auth-user");
const userRouter = require("../user-schema/userRouter");
const restricted = require("../middlewares/restricted-middleware");
const movieRoutes = require("../routes/movieRoute");
const resetPassword = require("../auth/resetPassword");

const server = express();

server.use(express.json());
server.use(cors());
server.use("/", movieRoutes);
server.use("/api", resetPassword);
server.use("/api/auth", authUser);
server.use("/api/users", userRouter);

module.exports = server;
