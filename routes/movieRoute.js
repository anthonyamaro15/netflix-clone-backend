require("dotenv").config();
const express = require("express");
const axios = require("axios");
const redis = require("redis");
const { 
   addMovie, 
   find, 
   getFavMovies, 
   removeFav 
} = require("../user-schema/user-model");
const { apiKey, apiUrl } = require('../envVariables');


const client = redis.createClient(process.env.REDIS_URL);

const route = express.Router();

route.get('/', (req, res) => {
   res.status(200).json({ message: "server running."});
});

// make API request and cache data
async function getMovieData(props) {
   const { res, page, type, url } = props;

   try {
      const response = await axios.get(url);
      const results = addNewProperties(response.data.results, type);
      client.setex(type, 120, JSON.stringify([{ page }, ...results]));
      return res.status(200).json(results);  
   } catch (error) {
      return res.status(500).json({ errorMessage: error.message });
   }
}

route.get("/browse/:page", (req, res) => {
  const { page } = req.params;
  const type = 'browse';
  const url = `${apiUrl}/movie/popular?api_key=${apiKey}&language=en-US&page=${page}`;

  

  client.get(type, (err, data) => {
    if (err) {
      res.status(500).json({ errorMessage: "there was an error", error: err });
    }
    if (data !== null) {
       // if data in is in chache check if the page is the same 
       // if it is the same send cache data to user
      let results = JSON.parse(data);
      if(results[0].page === page) {
         res.status(200).json(results);
      } else {
         // if user requested a new page, then call getMovieData
         getMovieData({ res, page, type, url });
      }
    } else {
       // if data not in cache, make API request
       getMovieData({ res, page, type, url });
    } 
  });
});

route.get("/tvpopular/:page", (req, res) => {
  const { page } = req.params;
  const type = 'tvpopular';
  const url = `${apiUrl}/tv/popular?api_key=${apiKey}&language=en-US&page=${page}`;

  client.get(type, (err, data) => {
    if (err) {
      res.status(500).json({ errorMessage: "there was an error", error: err });
    }
    if (data !== null) {
      let results = JSON.parse(data);
      if(results[0].page === page) {
         res.status(200).json(results);
      } else {
         getMovieData({ res, page, type, url });
      }
    } else {
       getMovieData({ res, page, type, url });
    }
  });
});

route.get("/latestrated/:page", (req, res) => {
  const { page } = req.params;
  const type = 'latestrated';
  const url = `${apiUrl}/movie/top_rated?api_key=${apiKey}&language=en-US&page=${page}`;

  client.get(type, (err, data) => {
    if (err) {
      res.status(500).json({ errorMessage: "there was an error", error: err });
    }
    if (data !== null) {
      let results = JSON.parse(data);
      if(results[0].page === page) {
         res.status(200).json(results);
      } else {
         getMovieData({ res, page, type, url });
      }
    } else {
       getMovieData({ res, page, type, url });
    }
  });
});

route.get("/playingmovie/:page", (req, res) => {
  const { page } = req.params;
  const type = 'playingmovie';
  const url = `${apiUrl}/movie/now_playing?api_key=${apiKey}&language=en-US&page=${page}`;

  client.get(type, (err, data) => {
    if (err) {
      res.status(500).json({ errorMessage: "there was an error", error: err });
    }
    if (data !== null) {
      let results = JSON.parse(data);
      if(results[0].page === page) {
         res.status(200).json(results);
      } else {
         getMovieData({ res, page, type, url });
      }
    } else {
       getMovieData({ res, page, type, url });
    }
  });
});

route.post("/tofavorites", async (req, res) => {
  const body = req.body;

  try {
     const fav = await addMovie(body);
     res.status(201).json(fav);
  } catch (error) {
     res.status(500).json({ errorMessage: error.message });
  }
});

route.get("/getfavorites/:id", async (req, res) => {
  const { id } = req.params;

  try {
     const movies = await getFavMovies(id);
     res.status(200).json(movies);
  } catch (error) {
     res.status(500).json({ errorMessage: error.message });
  }
});

route.delete("/remove/:user_id/:movie_id", async (req, res) => {
  const { user_id, movie_id } = req.params;

  try {
     await removeFav(user_id, movie_id);
     res.status(200).json({ message: 'Removed successfully' });
  } catch (error) {
     res.status(500).json({ errorMessage: error.message });
  }
});

route.get("/users", async (req, res) => {
   try {
      const users = await find();
      res.status(200).json(users);
   } catch (error) {
      res.status(500).json({ errorMessage: error.message });
   }
});


// adds new properties to API data so user can add movies to favorite list
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
