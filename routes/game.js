const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");

router.get("/play", async function (req, res, next) {
  // TODO: Implement Game
  let results = await questionController.getAllQuestions();

  res.render("play", { user: req.session.user, questions: results });
});

router.post("/gameFinished", function (req, res, next) {
  // implement game
  let answers = req.body;
  console.log(answers);

  res.render("finishedGame", { user: req.session.user });
});

module.exports = router;
