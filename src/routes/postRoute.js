const express = require("express");
const router = express.Router();
const likeController = require("../controllers/likeController");
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");
const upload = require("../middlewares/upload");

router.route("/").post(upload.single("image"), postController.createPost);
router.route("/:postId").patch(upload.single("image"), postController.updatePost).delete(postController.deletePost);
router.route("/:postId/likes").post(likeController.toggleLike);
router.route("/:postId/comments").post(commentController.createComment);
router.route("/:postId/comments/:commentId").patch(commentController.updateComment);
router.route("/:postId/comments/:commentId").delete(commentController.deleteComment);
module.exports = router;
