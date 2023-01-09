module.exports = (sequelize) => {
  const Like = sequelize.define("Like", {}, { underscored: true });

  Like.associate = (db) => {
    Like.belongsTo(db.User, {
      foriegnKey: { name: "userId", allowNull: false },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT"
    });
    Like.belongsTo(db.Post, {
      foriegnKey: { name: "postId", allowNull: false },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT"
    });
  };
  return Like;
};
