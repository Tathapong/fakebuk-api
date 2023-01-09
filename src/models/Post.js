module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      title: DataTypes.STRING,
      image: DataTypes.STRING
    },
    { underScored: true }
  );

  Post.associate = (db) => {
    Post.belongsTo(db.User, {
      foriegnKey: { name: "userId", allowNull: false },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT"
    });

    Post.hasMany(db.Like, {
      foriegnKey: { name: "postId", allowNull: false },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT"
    });
    Post.hasMany(db.Comment, {
      foriegnKey: { name: "postId", allowNull: false },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT"
    });
  };

  return Post;
};
