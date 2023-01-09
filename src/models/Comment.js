module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      }
    },
    { underscored: true }
  );

  Comment.associate = (db) => {
    Comment.belongsTo(db.User, {
      foriegnKey: { name: "userId", allowNull: false },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT"
    });
    Comment.belongsTo(db.Post, {
      foriegnKey: { name: "postId", allowNull: false },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT"
    });
  };
  return Comment;
};
