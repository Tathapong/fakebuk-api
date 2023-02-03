const AppError = require("../utilities/appError");
const { User, Comment } = require("../models/index");

const checkEmptyInput = (title) => {
  if (!title || !title.trim()) throw new AppError("title  is required", 400);
};
const checkAuthorizeEdit = (comment, userId) => {
  if (comment.userId !== userId) throw new AppError("No authorize to edit other user's post", 401);
};

const optionComment = (comment) => {
  return {
    where: { id: comment.id },
    include: { model: User, attributes: { exclude: ["password"] } },
    attributes: { exclude: "userId" }
  };
};

exports.createComment = async (req, res, next) => {
  try {
    const { title } = req.body;
    const { postId } = req.params;
    const { id: userId } = req.user;
    checkEmptyInput(title);

    const newComment = await Comment.create({ title, userId, postId });
    const comment = await Comment.findOne(optionComment(newComment));
    res.status(200).json({ comment });
  } catch (err) {
    next(err);
  }
};

exports.updateComment = async (req, res, next) => {
  try {
    const { title } = req.body;
    const { commentId } = req.params;

    const { id: userId } = req.user;
    checkEmptyInput(title);

    const comment = await Comment.findOne({ where: { id: commentId } });
    checkAuthorizeEdit(comment, userId);

    await Comment.update({ title }, { where: { id: commentId, userId } });
    res.status(200).json({ comment: title });
  } catch (err) {
    next(err);
  }
};
exports.deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    const { id: userId } = req.user;

    const comment = await Comment.findOne({ where: { id: commentId } });
    checkAuthorizeEdit(comment, userId);

    await comment.destroy();
    res.status(200).json();
  } catch (err) {
    next(err);
  }
};
