require("dotenv").config();

const express = require("express");
const ejs = require("ejs");
const path = require("path");
const Blog = require("./models/blog")

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const { default: mongoose } = require("mongoose");

const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie} = require("./middlewares/authentication")

const app = express();
const PORT = process.env.PORT || 9000;

mongoose.connect(process.env.MONGO_URL).then(() => console.log("MongoDb is connected"))

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")))

app.get("/", async (req, res) => {
    const allBlogs = await Blog.find({})
    return res.render("home", {
        user: req.user,
        blogs: allBlogs,
    });
});

app.use("/user", userRoute);
app.use("/blog",blogRoute )

// app.listen(PORT, () => console.log(`SERVER IS RUNNING ON PORT: ${PORT}`));
module.exports = app;
