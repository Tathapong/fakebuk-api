const { FRIEND_ACCEPTED, FRIEND_PENDDING } = require("../config/constants");
module.exports = (sequelize, DataTypes) => {
  const Friend = sequelize.define(
    "Friend",
    {
      status: {
        type: DataTypes.ENUM(FRIEND_ACCEPTED, FRIEND_PENDDING),
        allowNull: false,
        defaultValue: FRIEND_PENDDING
      }
    },
    { underscored: true }
  );

  return Friend;
};
