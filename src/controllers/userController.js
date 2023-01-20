const cloudinary = require("../utilities/cloudinary");
const { User } = require("../models/index");
const fs = require("fs");
const AppError = require("../utilities/appError");

exports.updateUser = async (req, res, next) => {
  try {
    const { password, ...updateValue } = req.body; // Not include password (in case of password is avaiable)

    // Case upload profile image
    if (req.files.profileImage) {
      const profileImage = req.user.profileImage;

      const secureUrl = await cloudinary.upload(
        req.files.profileImage[0].path,
        profileImage ? cloudinary.getPublicId(profileImage) : undefined
      ); // upload profile image to cloudinary
      fs.unlinkSync(req.files.profileImage[0].path); // remove profile image from public/images
      updateValue.profileImage = secureUrl;
    }

    // Case upload cover image
    if (req.files.coverImage) {
      const coverImage = req.user.coverImage;

      const secureUrl = await cloudinary.upload(
        req.files.coverImage[0].path,
        coverImage ? cloudinary.getPublicId(coverImage) : undefined
      ); // upload cover image to cloudinary
      fs.unlinkSync(req.files.coverImage[0].path); // remove cover image from public/images
      updateValue.coverImage = secureUrl;
    }

    await User.update(updateValue, { where: { id: req.user.id } }); // update user to database
    const user = await User.findOne({ where: { id: req.user.id }, attributes: { exclude: "password" } }); // get user from database after update

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

exports.getUserFriends = async (req, res, next) => {
  try {
    const id = req.params;

    const user = await User.findOne({ where: { id }, attributes: { exclude: "password" } });
    if (!user) throw new AppError("user not found", 400);
  } catch (err) {
    next(err);
  }
};
