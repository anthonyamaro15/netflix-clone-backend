const db = require("../data/db-config");

function add(user) {
  return db("users").insert(user, "id");
}

function findBy(email) {
  return db("users").where(email).first();
}

function findById(id) {
  return db("users").where({ id }).first();
}

function find() {
  return db("users as u").select(".u.email");
}

// favorites
async function addMovie(movie) {
  let [movie_id] = await db("favorite").insert(movie, "id");
  return findMovieById(movie_id);
}

function findMovieById(id) {
  return db("favorite").where({ id }).first();
}

async function getFavMovies(id) {
  return db("favorite as f")
    .join("users as u", "f.user_id", "u.id")
    .where({ "u.id": id })
    .select(
      "f.movie_id",
      "f.backdrop_path",
      "f.id",
      "f.original_language",
      "f.original_title",
      "f.popularity",
      "f.overview",
      "f.poster_path",
      "f.title",
      "f.vote_average",
      "f.vote_count",
      "f.release_date",
      "f.user_id",
      "f.joined",
      "f.category",
      "f.first_air_date",
      "f.name"
    );
}

async function removeFav(user_id, movie_id) {
  return db("favorite as f")
    .where({ "f.user_id": user_id })
    .where({ "f.movie_id": movie_id })
    .del();
}

module.exports = {
  add,
  addMovie,
  findBy,
  find,
  getFavMovies,
  findById,

  removeFav,
};
