exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.increments();
      table.string("email", 128).notNullable().unique();
      table.string("username", 128).notNullable().unique();
      table.string("password", 128).notNullable();
    })
    .createTable("favorite", (table) => {
      table.increments();
      table.string("backdrop_path", 255).notNullable();
      table.integer("movie_id").notNullable();
      table.string("original_language", 255);
      table.string("original_title", 255);
      table.string("original_name", 255);
      table.float("popularity");
      table.text("overview");
      table.string("first_air_date", 255);
      table.string("poster_path", 255);
      table.string("title", 255);
      table.float("vote_average");
      table.float("vote_count");
      table.boolean("joined");
      table.string("name", 255);
      table.string("category", 255);
      table.string("release_date", 255);
      table.integer("user_id").unsigned().notNullable().references("users.id");
      //   .onUpdate("CASCADE")
      //   .onDelete("CASCADE");
    });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("favorite").dropTableIfExists("users");
};
