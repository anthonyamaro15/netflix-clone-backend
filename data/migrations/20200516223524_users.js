exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.increments();
      table.string("email", 128).notNullable().unique();
      table.string("username", 128).notNullable().unique();
      table.string("password", 128).notNullable();
    })
    .createTable("favorite", (table) => {
      table.increments("f_id");
      table.string("backdrop_path", 255).notNullable();
      table.integer("id").notNullable();
      table.string("original_language", 255).notNullable();
      table.string("original_title", 255);
      table.float("popularity");
      table.string("overview", 255);
      table.string("poster_path", 255);
      table.string("title", 255);
      table.float("vote_average");
      table.integer("vote_count");
    })
    .createTable("user_movie", (table) => {
      table.increments();
      table
        .integer("movie_id")
        .unsigned()
        .notNullable()
        .references("favorite.f_id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("users.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("user_movie")
    .dropTableIfExists("favorite")
    .dropTableIfExists("users");
};
