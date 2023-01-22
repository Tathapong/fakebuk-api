const express = require("express");
const router = express.Router();
const friendController = require("../controllers/friendController");

router
  .route("/:friendId")
  .delete(friendController.deleteFriend)
  .post(friendController.addFriend)
  .patch(friendController.updateFriend);

module.exports = router;
