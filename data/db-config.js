const knex = require("knex");
const config = require("../knexfile");
const envirenment = process.env.NODE_ENV || "development";

const db = knex(config[envirenment]);

module.exports = db;
