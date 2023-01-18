const cloudinary = require("../utilities/cloudinary");

exports.updateUser = async (req, res, next) => {
  try {
    await cloudinary.upload(req.files.profileImage[0].path);
    res.status(200).json("success");
  } catch (err) {
    next(err);
  }
};
