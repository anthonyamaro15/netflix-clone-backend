exports.seed = function (knex) {
  // Inserts seed entries
  return knex("users").insert([
    { email: "example1@gamil.com", username: "user1", password: "pass1" },
    { email: "example2@gamil.com", username: "user2", password: "pass2" },
    { email: "example3@gamil.com", username: "user3", password: "pass3" },
  ]);
};
