const multer = require("multer");

//+ multer.diskStorage เป็น Function ที่ใช้กำหนด ตำแหน่ง และ ชื่อของไฟล์ที่จะจัดเก็บ
const storage = multer.diskStorage({
  // Destivation of upload file
  // req : request object of Express
  // file : binary data of upload
  // cb : callback function that have error? and have 2 parameter ()
  destination: (req, file, cb) => {
    cb(null, "public/images"); // define destination at public/images
  },

  // Filename of upload file
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "" + Math.round(Math.random() * 10000000000) + "." + file.mimetype.split("/")[1]); // define filename as time in second (กำหนด extention .jpg ด้วย จาก file.mimetype.split)
  }
}); //return object storage

//+ Filter file
// const fileFilter = (req, file, cb) => {
//   const type = file.mimetype.split("/")[1];
//   const arrType = ["jpg", "jpeg", "png"];
//   if (arrType.includes(type)) cb(null, true);
//   else cb(null, false);
// };

module.exports = multer({ storage }); // return middleware
