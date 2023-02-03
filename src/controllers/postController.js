const AppError = require("../utilities/appError");
const fs = require("fs");
const cloudinary = require("../utilities/cloudinary");
const postService = require("../services/postService");
const { Post, User, Comment, Like } = require("../models/index");
const { sequelize } = require("../models/index");

const postOption = (postId) => {
  return {
    where: { id: postId },
    include: [
      { model: User, attributes: { exclude: ["password"] } },
      { model: Like },
      {
        model: Comment,
        attributes: { exclude: ["userId"] },
        include: { model: User, attributes: { exclude: "password" } }
      }
    ],
    attributes: { exclude: ["userId"] }
  };
};

const checkEmptyInput = (title, imageFile) => {
  if ((!title || !title.trim()) && !imageFile) throw new AppError("title or image is required", 400);
};

const checkAuthorizeEdit = (post, userId) => {
  if (post.userId !== userId) throw new AppError("No authorize to edit other user's post", 403);
};

const deleteCacheImage = (imageFile) => {
  if (imageFile) fs.unlinkSync(imageFile.path); //ที่ใส่ไว้ในนี้เพราะว่า ในกรณีที่เกิด Error และไม่เกิด Error มันก็ควรจะลบไฟล์
};

exports.createPost = async (req, res, next) => {
  try {
    const title = req.body.title;
    const imageFile = req.file;
    const { id: userId } = req.user;

    checkEmptyInput(title, imageFile);

    const data = { userId };
    if (title) data.title = title.trim() ? title.trim() : undefined;
    if (imageFile) data.image = await cloudinary.upload(imageFile.path, undefined);

    const { id: postId } = await Post.create(data); // Create new post
    const post = await Post.findOne(postOption(postId)); // get post that include like, comment, user
    res.status(201).json({ post });
  } catch (err) {
    next(err);
  } finally {
    const imageFile = req.file;
    deleteCacheImage(imageFile);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { title, image } = req.body;
    const imageFile = req.file;
    const { id: userId } = req.user;

    const currentPost = await Post.findOne({ where: { id: postId } });
    checkAuthorizeEdit(currentPost, userId);
    const publicId = currentPost.image ? cloudinary.getPublicId(currentPost.image) : undefined; // Check image in post (existing of publicId)

    const data = { userId };
    if (title) data.title = title.trim();
    else data.title = "";

    if (imageFile) data.image = await cloudinary.upload(imageFile.path, publicId);
    else if (image) data.image = image;
    else {
      data.image = null;
      publicId && (await cloudinary.deleteResource(publicId));
    }

    console.log(data);

    if (!data.title && data.image === null) throw new AppError("title or image is required", 400);

    await Post.update(data, { where: { id: postId } });
    const post = await Post.findOne(postOption(postId));
    res.status(200).json({ post });
  } catch (err) {
    next(err);
  } finally {
    const imageFile = req.file;
    deleteCacheImage(imageFile);
  }
};

exports.deletePost = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { postId } = req.params;
    const { id: userId } = req.user;

    const currentPost = await Post.findOne({ where: { id: postId } });
    if (!currentPost) throw new AppError("post was not found", 400);
    checkAuthorizeEdit(currentPost, userId);

    if (currentPost.image) {
      const publicId = cloudinary.getPublicId(currentPost.image);
      await cloudinary.deleteResource(publicId);
    }

    await Comment.destroy({ where: { postId }, transaction: t });
    await Like.destroy({ where: { postId }, transaction: t });
    await currentPost.destroy({ transaction: t });
    await t.commit();

    return res.status(200).json();
  } catch (err) {
    await t.rollback();
    next(err);
  } finally {
  }
};

exports.getUserPosts = async (req, res, next) => {
  try {
    const { include } = req.query;
    const userId = +req.params.userId;

    const posts = await postService.findUserPost(userId, include);
    res.status(200).json({ posts });
  } catch (err) {
    next(err);
  } finally {
  }
};
