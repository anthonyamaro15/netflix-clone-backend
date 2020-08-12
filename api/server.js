const express = require("express");
const cors = require("cors");

const authUser = require("../auth/auth-user");
const userRouter = require("../user-schema/userRouter");
const restricted = require("../middlewares/restricted-middleware");

const server = express();

server.use(express.json());
server.use(cors());
server.use("/api/auth", authUser);
server.use("/api/users", restricted, userRouter);

module.exports = server;
