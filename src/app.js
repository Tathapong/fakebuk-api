require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const notFoundMiddleware = require("./middlewares/notFound");
const errorMiddleware = require("./middlewares/error");

const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const friendRoute = require("./routes/friendRoute");
const postRoute = require("./routes/postRoute");

const authenticate = require("./middlewares/authenticate");

const app = express();

//* Option tool (develop) for morgan
// มันจะ log request http
if (process.env.NODE_ENV === "development") {
  app.use(morgan());
}

// const { sequelize } = require("./models/index");
// sequelize.sync({ alter: true });

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/auth", authRoute);
app.use("/users", authenticate, userRoute);
app.use("/friends", authenticate, friendRoute);
app.use("/posts", authenticate, postRoute);

// const { Comment } = require("./models/index");

// app.use("/test", authenticate, async (req, res, next) => {
//   await Comment.create({ title: "Fun", postId: 17, userId: 90 });
//   res.send({ message: "OK" });
// });

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT;

app.listen(port, () => {
  console.log("server running on port : " + port);
});
