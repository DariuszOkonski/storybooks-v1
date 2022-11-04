const express = require("express");
const { ensureAuthenticated, ensureGuest } = require("../helpers/auth");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("stories/index");
});

router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("stories/add");
});

module.exports = router;
