const cloudinary = require("../config/cloudinary");

exports.upload = async (path) => {
  const res = await cloudinary.uploader.upload(path);
  console.log(res);
};
