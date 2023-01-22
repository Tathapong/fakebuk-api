const { Friend, User } = require("../models/index");
const { Op } = require("sequelize");
const {
  FRIEND_ACCEPTED,
  FRIEND_STATUS_ANNONYMOUS,
  FRIEND_STATUS_ME,
  FRIEND_STATUS_FRIEND,
  FRIEND_PENDING,
  FRIEND_STATUS_ACCEPTER,
  FRIEND_STATUS_REQUESTER
} = require("../config/constants");

//* return array of user's friends by user id
exports.findUserFriendsByUserId = async (meId, userId) => {
  // Find friend of the user (id) by pass id
  const friends = await Friend.findAll({
    // SELECT * FROM friends WHERE status = 'ACCEPTED' AND (requester_id='2' OR accepter_id = '2')
    where: { status: FRIEND_ACCEPTED, [Op.or]: [{ requesterId: userId }, { accepterId: userId }] },
    raw: true
  });

  // Extract only friend id from Array friends (exclude login user id)
  const friendIds = friends.map((item) => {
    // if (meId !== item.requesterId && meId !== item.accepterId) {
    return item.requesterId === userId ? item.accepterId : item.requesterId;
    // }
  });

  // Get user data (friend data) from User by pass Array of friend if
  return User.findAll({ where: { id: friendIds }, attributes: { exclude: "password" } });
};

exports.findStatusWithMe = async (meId, userId) => {
  if (meId === userId) return FRIEND_STATUS_ME;

  // SELECT * FROM friend WHERE (requester_id = meId AND accepter_id = userId) OR (requester_id = userId AND accepter_id = meId)
  const friend = await Friend.findOne({
    where: {
      [Op.or]: [
        { requester_id: meId, accepterId: userId },
        { requester_id: userId, accepterId: meId }
      ]
    },
    raw: true
  });

  if (!friend) return FRIEND_STATUS_ANNONYMOUS;

  if (friend.status === FRIEND_ACCEPTED) return FRIEND_STATUS_FRIEND;

  if (friend.status === FRIEND_PENDING) {
    if (friend.requesterId === meId) return FRIEND_STATUS_REQUESTER; // ส่ง Status ของเรา ที่มีต่อ friend
    else if (friend.accepterId === meId) return FRIEND_STATUS_ACCEPTER;
  }

  return;
};
