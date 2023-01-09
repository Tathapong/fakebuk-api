module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      mobile: {
        type: DataTypes.STRING,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      profileImage: DataTypes.STRING,
      coverImage: DataTypes.STRING
    },
    { underscored: true }
  );

  User.associate = (db) => {
    User.hasMany(db.Post, {
      foriegnKey: { name: "userId", allowNull: false },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT"
    });
    User.hasMany(db.Comment, {
      foriegnKey: { name: "userId", allowNull: false },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT"
    });
    User.hasMany(db.Like, {
      foriegnKey: { name: "userId", allowNull: false },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT"
    });
    User.hasMany(db.Friend, {
      as: "Requester",
      foriegnKey: { name: "requesterId", allowNull: false },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT"
    });
    User.hasMany(db.Friend, {
      as: "Accepter",
      foriegnKey: { name: "accepterId", allowNull: false },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT"
    });
  };
  return User;
};
