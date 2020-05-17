const User = require("../user-schema/user-model");

function validateId(req, res, next) {
  const { id } = req.params;

  User.findFavById(id)
    .then((user) => {
      if (user.length > 0) {
        next();
      } else {
        res.status(404).json({ message: "Invalid id" });
      }
    })
    .catch(({ error, message }) => {
      res.status(500).json({ message: "there was an error", message });
    });
}

module.exports = {
  validateId,
};
