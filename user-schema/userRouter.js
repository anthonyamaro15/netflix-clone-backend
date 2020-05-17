const express = require("express");
const User = require("./user-model");
const { validateId } = require("../middlewares/validate");

const route = express.Router();

route.get("/", (req, res) => {
  User.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch(({ error, message }) => {
      res.status(400).json({ error, message });
    });
});

route.get("/:id/favorites", (req, res) => {
  const { id } = req.params;
  User.userFavMovies(id)
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch(({ error, message }) => {
      res.status(404).json({ error, message });
    });
});

route.post("/:id/favorites", (req, res) => {
  const { id } = req.params;
  User.addMovie(id, req.body)
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ errorMessage: "there was an error adding the movie" });
    });
});

// route.delete("/favorites/:id", validate.validateId, (req, res) => {
//   const { id } = req.params;
//   User.removeFav(id)
//     .then((movie) => {
//       console.log("here", movie);
//       res.status(200).json(movie);
//     })
//     .catch((err) => {
//       res.status(500).json({ message: "there was an error" });
//     });
// });

module.exports = route;
