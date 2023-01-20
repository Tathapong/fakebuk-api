require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const notFoundMiddleware = require("./middlewares/notFound");
const errorMiddleware = require("./middlewares/error");

const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");

const authenticate = require("./middlewares/authenticate");

const app = express();

const { Post, Comment, Like } = require("./models/index");
Post.sync();
Comment.sync();
Like.sync();

//* Option tool (develop) for morgan
// มันจะ log request http
if (process.env.NODE_ENV === "development") {
  app.use(morgan());
}

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/auth", authRoute);
app.use("/users", authenticate, userRoute);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT;

app.listen(port, () => {
  console.log("server running on port : " + port);
});
