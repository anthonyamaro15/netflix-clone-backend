exports.seed = function (knex) {
  // Inserts seed entries
  return knex("user_movie").insert([
    { movie_id: 1, user_id: 1 },
    { movie_id: 1, user_id: 1 },
    { movie_id: 2, user_id: 1 },
    { movie_id: 3, user_id: 1 },
    { movie_id: 4, user_id: 1 },
    { movie_id: 1, user_id: 2 },
    { movie_id: 1, user_id: 3 },
    { movie_id: 4, user_id: 3 },
    { movie_id: 3, user_id: 1 },
  ]);
};
