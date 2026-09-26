const { findUserById } = require("../services/userService");

function getUser(req, res) {
  const userId = req.params.id;

  const user = findUserById(userId);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.json(user);
}

module.exports = {
  getUser,
};