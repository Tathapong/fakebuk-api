const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticate = require("../middlewares/authenticate");
const upload = require("../middlewares/upload");

// การใช้ upload ต้องใช้เป็น method มี 3 วิธี
// 1. single (fieldname) : upload only 1 file and only 1 fieldname (binary data)
// 2. array (fieldname[, maxCount]) : upload multiple file and can set maxCount(max file), only 1 fieldname (binary data) ex firstName, lastName, profileImage(binary : 1 field)
// 3. field(fields) : upload multiple file and multiple fieldname ex firstName, lastName, profileImage(binary), coverImage(binary)

// หลังจากทำ middleware upload เสร็จมันจะเก็บไฟล์ไว้ใน destination และจะเก้บข้อมูลไฟล์ที่เรา upload ไว้ที่ req.files (array)
router.route("/").patch(
  authenticate,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  userController.updateUser
);

module.exports = router;
