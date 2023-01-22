const { Friend } = require("../models/index");
const { Op } = require("sequelize");
const AppError = require("../utilities/appError");
const { FRIEND_PENDING, FRIEND_ACCEPTED } = require("../config/constants");

exports.deleteFriend = async (req, res, next) => {
  try {
    const friendId = +req.params.friendId;

    // DELETE  FROM friends WHERE (requester_id = req.user.id AND accepter_id = friendId) OR (requester_id = friendId AND accepter_id = req.user.id)
    await Friend.destroy({
      where: {
        [Op.or]: [
          { requesterId: req.user.id, accepterId: friendId },
          { requesterId: friendId, accepterId: req.user.id }
        ]
      }
    });

    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

exports.addFriend = async (req, res, next) => {
  try {
    const friendId = +req.params.friendId;
    const userId = req.user.id;

    const existFriend = await Friend.findOne({
      where: {
        [Op.or]: [
          {
            requesterId: userId,
            accepterId: friendId
          },
          {
            requesterId: friendId,
            accepterId: userId
          }
        ]
      }
    });

    if (existFriend) throw new AppError("already friend or pending", 400);

    await Friend.create({ status: FRIEND_PENDING, requesterId: req.user.id, accepterId: friendId }, { raw: true });
    res.status(200).json({ message: "success request friend" });
  } catch (err) {
    next(err);
  }
};

exports.updateFriend = async (req, res, next) => {
  try {
    const friendId = +req.params.friendId;
    const userId = req.user.id;

    const result = await Friend.update(
      { status: FRIEND_ACCEPTED },
      { where: { requesterId: friendId, accepterId: userId, status: FRIEND_PENDING } }
    );
    if (!result[0]) throw new AppError("No have request", 400);
    res.status(200).json({ message: "success add friend" });
  } catch (err) {
    next(err);
  }
};
