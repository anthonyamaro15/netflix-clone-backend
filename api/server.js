const express = require("express");
const cors = require("cors");
const axios = require("axios");

const authUser = require("../auth/auth-user");
const userRouter = require("../user-schema/userRouter");
const restricted = require("../middlewares/restricted-middleware");
const { response } = require("express");

const server = express();

server.use(express.json());
server.use(cors());
server.use("/api/auth", authUser);
server.use("/api/users", restricted, userRouter);

module.exports = server;

async function getMovies(url) {
  try {
    const data = await axios.get(url);
    let movie1 = data.data.results;
    return movie1;
  } catch (error) {
    return {
      error,
    };
  }
}

server.get("/movie", async (req, res) => {
  let browse = await getMovies(
    `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.MOVIE_API}&language=en-US`
  );

  let tvShows = await getMovies(
    `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.MOVIE_API}&language=en-US`
  );

  let movies = await getMovies(
    `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.MOVIE_API}&language=en-US`
  );

  let latest = await getMovies(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.MOVIE_API}&language=en-US`
  );

  let container = {
    browse,
    tvShows,
    movies,
    latest,
  };

  //   console.log("here ", movies);
  res.json(container);
});
