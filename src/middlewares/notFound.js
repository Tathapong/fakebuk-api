module.exports = function (req, res, next) {
  res.status(404).json({ message: "resource not found on this server" });
};
