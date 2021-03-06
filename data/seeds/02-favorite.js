exports.seed = function (knex) {
  // Inserts seed entries
  return knex("favorite").insert([
    {
      backdrop_path: "this is test one",
      movie_id: 122,
      original_language: "es",
      original_title: "title movie",
      popularity: 12.2,
      overview: "overview for test one",
      poster_path: "this is the path for poster one",
      title: "title for movie one",
      vote_average: 1.2,
      vote_count: 2323,
      joined: false,
      category: "browse",
      user_id: 1,
      release_date: "testing hahahah",
      first_air_date: "",
      name: "",
    },
    {
      backdrop_path: "this is test 2",
      movie_id: 1232,
      original_language: "es",
      original_title: "avengeers",
      popularity: 12.22,
      overview: "overview for test 2",
      poster_path: "this is the path for poster 2",
      title: "title for movie 2",
      vote_average: 1.23,
      joined: false,
      category: "browse",
      vote_count: 2323,
      user_id: 1,
      release_date: "testing hahahah",
      first_air_date: "",
      name: "",
    },
    {
      backdrop_path: "this is test 3",
      movie_id: 122,
      original_language: "es",
      original_title: "title hulk",
      popularity: 12.2,
      overview: "overview for test 3",
      poster_path: "this is the path for poster 3",
      title: "title for movie 3",
      vote_average: 1.2,
      vote_count: 2323,
      joined: false,
      category: "browse",
      user_id: 1,
      first_air_date: "",
      name: "",
      release_date: "testing hahahah",
    },
    {
      backdrop_path: "this is test 4",
      movie_id: 122,
      original_language: "es",
      original_title: "title spider man",
      popularity: 12.2,
      overview: "overview for test 4",
      poster_path: "this is the path for poster 4",
      title: "title for movie 4",
      vote_average: 1.2,
      vote_count: 2323,
      joined: false,
      category: "browse",
      user_id: 1,
      release_date: "testing hahahah",
      first_air_date: "",
      name: "",
    },
  ]);
};
