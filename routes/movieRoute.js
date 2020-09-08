require("dotenv").config();
const express = require("express");
const axios = require("axios");
const redis = require("redis");
const Favorite = require("../user-schema/user-model");

const client = redis.createClient(process.env.REDIS_URL);

const route = express.Router();

route.get("/browse/:page", (req, res) => {
  const { page } = req.params;
  client.get("browse", (err, data) => {
    if (err) {
      res.status(500).json({ errorMessage: "there was an error", error: err });
    }
    if (data !== null && Number(page) === 1) {
      let results = JSON.parse(data);
      res.status(200).json(results);
    } else {
      axios
        .get(
          `${process.env.URL}/movie/popular?api_key=${process.env.API_KEY}&language=en-US&page=${page}`
        )
        .then((response) => {
          let results = addNewProperties(response.data.results, "browse");
          client.setex("browse", 120, JSON.stringify(results));
          res.status(200).json(results);
        })
        .catch((err) => {
          res.status(500).json({ errorMessage: err.message });
        });
    }
  });
});

route.get("/tvpopular/:page", (req, res) => {
  const { page } = req.params;
  client.get("tvpopular", (err, data) => {
    if (err) {
      res.status(500).json({ errorMessage: "there was an error", error: err });
    }
    if (data !== null && Number(page) === 1) {
      let results = JSON.parse(data);
      res.status(200).json(results);
    } else {
      axios
        .get(
          `${process.env.URL}/tv/popular?api_key=${process.env.API_KEY}&language=en-US&page=${page}`
        )
        .then((response) => {
          let results = addNewProperties(response.data.results, "tvpopular");
          client.setex("tvpopular", 120, JSON.stringify(results));

          res.status(200).json(response.data.results);
        })
        .catch((err) => {
          res.status(500).json({ errorMessage: err.message });
        });
    }
  });
});

route.get("/latestrated/:page", (req, res) => {
  const { page } = req.params;
  client.get("latestrated", (err, data) => {
    if (err) {
      res.status(500).json({ errorMessage: "there was an error", error: err });
    }
    if (data !== null && Number(page) === 1) {
      let results = JSON.parse(data);
      res.status(200).json(results);
    } else {
      axios
        .get(
          `${process.env.URL}/movie/top_rated?api_key=${process.env.API_KEY}&language=en-US&page=${page}`
        )
        .then((response) => {
          let results = addNewProperties(response.data.results, "latestrated");
          client.setex("latestrated", 120, JSON.stringify(results));

          res.status(200).json(response.data.results);
        })
        .catch((err) => {
          res.status(500).json({ errorMessage: err.message });
        });
    }
  });
});

route.get("/playingmovie/:page", (req, res) => {
  const { page } = req.params;
  client.get("playingmovie", (err, data) => {
    if (err) {
      res.status(500).json({ errorMessage: "there was an error", error: err });
    }
    if (data !== null && Number(page) === 1) {
      let results = JSON.parse(data);
      res.status(200).json(results);
    } else {
      axios
        .get(
          `${process.env.URL}/movie/now_playing?api_key=${process.env.API_KEY}&language=en-US&page=${page}`
        )
        .then((response) => {
          let results = addNewProperties(response.data.results, "playingmovie");
          client.setex("playingmovie", 120, JSON.stringify(results));

          res.status(200).json(response.data.results);
        })
        .catch((err) => {
          res.status(500).json({ errorMessage: err.message });
        });
    }
  });
});

route.post("/tofavorites", (req, res) => {
  const body = req.body;

  Favorite.addMovie(body)
    .then((fav) => {
      res.status(201).json(fav);
    })
    .catch((err) => {
      res.status(500).json({ errorMessage: err.message });
    });
});

route.get("/getfavorites/:id", (req, res) => {
  const { id } = req.params;

  Favorite.getFavMovies(id)
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      res.status(500).json({ errorMessage: err.message });
    });
});

route.delete("/remove/:user_id/:movie_id", (req, res) => {
  const { user_id, movie_id } = req.params;

  Favorite.removeFav(user_id, movie_id)
    .then((item) => {
      if (item > 0) {
        res.status(200).json({ message: "removed successfully" });
      } else {
        res.status(200).json({ message: "not favorite list for this user" });
      }
    })
    .catch((err) => {
      res.status(500).json({ errorMessage: err.message });
    });
});

function addNewProperties(arr, category) {
  const newArr = arr.map((movie) => {
    return {
      ...movie,
      joined: false,
      category: category,
    };
  });
  return newArr;
}

module.exports = route;
