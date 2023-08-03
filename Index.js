const express = require("express");
const connectdb = require("./Config/db");
const Useer = require("./Models/UserModel");
const Post = require("./Models/Post");
const { error } = require("console");
var multer = require("multer");
const app = express();
var fs = require("fs");
require("dotenv").config();
var cors = require("cors");

app.use(cors());
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
var ObjectId = require("mongodb").ObjectId;

app.use(express.json());

connectdb();

// multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads");
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + "-" + Date.now() + ".png");
//   },
// });

// const upload = multer({ storage: storage });

// app.post("/upload", upload.single("image"), async (req, res, next) => {
//   const { Title, Content, Tag } = await req.body;
//   console.log("here");
//   console.log(req.file);
//   const image = new Post({
//     Title,
//     Content,
//     Tag,
//     image: {
//       data: fs.readFileSync("uploads\\" + req.file.filename),
//       contentType: "image/png",
//     },
//   });
//   image
//     .save()
//     .then((res) => console.log("success"))
//     .catch((err) => console.log(err.message));
// });

//server
app.listen(500, () => {
  console.log("Server running on port  500");
});

//authorization
const auth = async (req, res, next) => {
  const token = req.headers["authorization"];

  if (token) {
    const key = token.split(" ")[1];
    jwt.verify(key, process.env.secret, (err, user) => {
      if (err) {
        res.sendStatus(err);
      }
      req.user = user;

      next();
    });
  } else {
    res.status(404).json({ error: "auth error" });
  }
};

//signup
app.post("/signup", async (req, res) => {
  const { userName, email, password } = await req.body;
  const u = await Useer.findOne({ userName: userName });
  if (u) {
    res.send("already exist");
    return;
  }

  const newUser = await new Useer({
    userName,
    password,
    email,
  });
  await newUser.save();
  if (newUser) {
    res.send(newUser);
  } else {
    res.send("can't make");
  }
});

//login

app.post("/", async (req, res) => {
  const { userName, email, password } = await req.body;
  console.log(userName);
  const u = await Useer.findOne({ userName: userName });

  if (u && u.password == password) {
    const token = await jwt.sign({ id: u._id }, process.env.secret, {
      expiresIn: "365d",
    });
    res.json(token);
    console.log(token);
  } else {
    res.status(500).json({ message: "invalid" });
  }
});

//upload post
app.post("/post", auth, async (req, res) => {
  const { Title, Content, Tag, image } = await req.body;
  console.log(req.user);
  const Owner = await req.user.id;

  const p = await new Post({
    Owner,
    Title,
    Content,
    Tag,
    image,
  });

  await p.save();
  res.json(p);
});

//retrive post
app.get("/allpost:tag", auth, async (req, res) => {
  console.log(req.params);

  const p = await Post.find({ Tag: req.params.tag })
    .sort({ _id: -1 })
    .limit(req.params.limit);

  await res.json(p);
});

//user posts
app.get("/mypost", auth, async (req, res) => {
  const admin = await req.user.id;
  const p = await Post.find({ Owner: admin });
  res.send(p);
  console.log(p);
});

app.get("/particular:id", auth, async (req, res) => {
  const id = req.params.id;

  var o_id = new ObjectId(id);

  const p = await Post.find({ _id: o_id });
  console.log(p);
  res.json(p);
});
