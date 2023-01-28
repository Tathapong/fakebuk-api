const { Like } = require("../models/index");
const AppError = require("../utilities/appError");

exports.toggleLike = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { postId } = req.params;
    // SELECT * FROM likes WHERE user_id = req.user.id AND post_id = id
    const existLike = await Like.findOne({ where: { userId, postId } });

    if (existLike) {
      await existLike.destroy();
      return res.status(200).json({ like: null });
    } else {
      const like = await Like.create({ userId, postId });
      return res.status(200).json({ like });
    }
  } catch (err) {
    next(err);
  }
};
