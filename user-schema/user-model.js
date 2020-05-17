const db = require("../data/db-config");

function add(user) {
  return db("users").insert(user);
}

async function addMovie(id, body) {
  const [addedId] = await db("favorite").insert(body, "id");
  console.log(addedId);

  return db("user_movie as um").where({
    "um.movie_id": addedId,
    "um.user_id": id,
  });
}

function findBy(email) {
  return db("users").where(email).first();
}

function findById(id) {
  return db("users").where({ id }).first();
}

function userFavMovies(id) {
  return db("user_movie as um")
    .join("favorite as f", "um.movie_id", "f.f_id")
    .where("um.user_id", id)
    .select(
      "f.backdrop_path",
      "f.id",
      "f.original_language",
      "f.original_title",
      "f.popularity",
      "f.overview",
      "f.poster_path",
      "f.title",
      "f.vote_average",
      "f.vote_count"
    );
}

function find() {
  return db("users");
}

function getFavMovies(id) {
  return db("users as u")
    .join("favorite as f", "u.id", "f.user_id")
    .where(`u.id`, id)
    .select("f.id", "f.favorite_movie");
}

function removeFav(id) {
  return db("users as u")
    .join("favorite as f", "u.id", "f.user_id")
    .where("f.id", id)
    .select("f.favorite_movie")
    .del();
}

module.exports = {
  add,
  addMovie,
  findBy,
  find,
  getFavMovies,
  findById,
  userFavMovies,
  removeFav,
};
