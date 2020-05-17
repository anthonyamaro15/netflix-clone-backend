module.exports = {
  development: {
    client: "pg",

    connection: "postgres://localhost/users",
    migrations: {
      directory: "./data/migrations",
    },
    seeds: {
      directory: "./data/seeds",
    },
  },
  //   development: {
  //     client: "sqlite3",
  //     useNullAsDefault: true,
  //     connection: {
  //       filename: "./data/users.db3",
  //     },
  //     migrations: {
  //       directory: "./data/migrations",
  //     },
  //     seeds: {
  //       directory: "./data/seeds",
  //     },
  //     pool: {
  //       afterCreate: (conn, done) => {
  //         conn.run("PRAGMA foreign_keys = ON", done);
  //       },
  //     },
  //   },

  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./data/migrations",
    },
    seeds: {
      directory: "./data/seeds",
    },
  },
};
