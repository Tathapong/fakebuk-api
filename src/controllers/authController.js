const AppError = require("../utilities/appError");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/index");

// function of generate token
const genToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET_KEY || "private_key", { expiresIn: process.env.JWT_EXPIRES || "7d" });

exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, emailOrMobile, password, confirmPassword } = req.body;

    // Validate
    if (!emailOrMobile) throw new AppError("email address or mobile is require", 400);
    if (!password) throw new AppError("password is required", 400);
    if (password !== confirmPassword) throw new AppError("password and confirm password did not match", 400);

    const isEmail = validator.isEmail(emailOrMobile + "");
    const isMobile = validator.isMobilePhone(emailOrMobile + "");

    if (!isEmail && !isMobile) throw new AppError("email address or mobile is invalid format", 400);
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user in database
    const user = await User.create({
      firstName,
      lastName,
      email: isEmail ? emailOrMobile : null,
      mobile: isMobile ? emailOrMobile : null,
      password: hashedPassword
    });

    const token = genToken({ id: user.id });
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};
exports.login = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
