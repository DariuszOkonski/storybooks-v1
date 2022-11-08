const express = require("express");
const { ensureAuthenticated, ensureGuest } = require("../helpers/auth");
const router = express.Router();
const mongoose = require("mongoose");
const Story = mongoose.model("stories");
const User = mongoose.model("users");

router.get("/", (req, res) => {
  Story.find({ status: "public" })
    .populate("user")
    .then((stories) => {
      res.render("stories/index", {
        stories,
      });
    });
});

router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("stories/add");
});

router.post("/", (req, res) => {
  let allowComments = false;

  if (req.body.allowComments) {
    allowComments = true;
  }

  const newStory = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments: allowComments,
    user: req.user.id,
  };

  new Story(newStory).save().then((story) => {
    res.redirect(`/stories/show/${story.id}`);
  });
});

module.exports = router;
