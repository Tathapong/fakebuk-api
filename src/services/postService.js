const friendService = require("./friendService");
const { Post, User, Like, Comment } = require("../models/index");

exports.findUserPost = async (userId, include) => {
  let friendIds = [];

  if (include === "friend") {
    // SELECT * FROM posts WHERE user_id IN [userId, friendId1, friendId2, ...]
    friendIds = await friendService.findUserFriendIdsByUserId(userId);
  }

  return await Post.findAll({
    where: { userId: [userId, ...friendIds] },
    include: [
      { model: User, attributes: { exclude: ["password"] } },
      { model: Like },
      {
        model: Comment,
        attributes: { exclude: ["userId"] },
        include: { model: User, attributes: { exclude: "password" } }
      }
    ],
    attributes: { exclude: ["userId"] },
    order: [["updatedAt", "DESC"]]
  });
};
