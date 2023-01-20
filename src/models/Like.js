module.exports = (sequelize) => {
  const Like = sequelize.define("Like", {}, { underscored: true });

  Like.associate = (db) => {
    Like.belongsTo(db.User, {
      foreignKey: { name: "userId", allowNull: false },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT"
    });
    Like.belongsTo(db.Post, {
      foreignKey: { name: "postId", allowNull: false },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT"
    });
  };
  return Like;
};
