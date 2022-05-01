var express = require("express");
var router = express.Router();
const Post = require("../model/post.js");

const errorHandler = require("../service/errorHandler");
const successHandler = require("../service/successHandler");

/* GET home page. */

router.get("/", (req, res) => {
  res.render("index", { title: "Express" });
});

router.get("/posts", async (req, res) => {
  const allData = await Post.find();
  successHandler(res, allData);
});

router.post("/posts", async (req, res) => {
  try {
    const data = req.body;

    if (data.title !== undefined) {
      const post = {
        tag: data.tag,
        userName: data.userName,
        title: data.title,
        content: data.content,
        imgUrl: data.imgUrl,
      };
      await Post.create(post).then(async () => {
        const allData = await Post.find();
        successHandler(res, allData);
      });
    } else {
      errorHandler(res, "POST title未填寫");
    }
  } catch (error) {
    console.log("req error", error);
    errorHandler(res, `POST 格式錯誤，${error}`);
  }
});

router.delete("/posts", async (req, res) => {
  await Post.deleteMany({})
    .then(async () => {
      const allData = await Post.find();
      successHandler(res, allData);
    })
    .catch((error) => {
      errorHandler(res, error);
    });
});

router.delete("/posts/:id", async (req, res) => {
  const id = req.params.id;
  await Post.findByIdAndDelete(id)
    .then(async () => {
      const allData = await Post.find();
      successHandler(res, allData);
    })
    .catch(() => {
      errorHandler(res, error);
    });
});

router.patch("/posts/:id", async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;

    if (data.title !== undefined) {
      const post = {
        tag: data.tag,
        userName: data.userName,
        title: data.title,
        content: data.content,
        imgUrl: data.imgUrl,
      };
      await Post.findByIdAndUpdate(id, post)
        .then(async () => {
          const allData = await Post.find();
          successHandler(res, allData);
        })
        .catch(() => {
          errorHandler(res, error);
        });
    } else {
      errorHandler(res, "格式錯誤或無該筆資料");
    }
  } catch (error) {
    errorHandler(res, "格式錯誤");
  }
});

module.exports = router;
