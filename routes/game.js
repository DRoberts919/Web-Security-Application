const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");
const leaderBoardController = require("../controllers/leaderBoardController");

router.get("/play", async function (req, res, next) {
  // TODO: Implement Game
  let results = await questionController.getAllQuestions("Questions", true);

  res.render("play", { user: req.session.user, questions: results });
});

router.post("/gameFinished", async function (req, res, next) {
  // implement game
  //data from the form submision
  let answers = req.body;
  let answersArr = [];
  //score for the game
  let score = 0;
  //setup questions into an answersArr
  for (var i in answers) {
    if (i === "correct_answer") {
      console.log("crrect");
    } else {
      answersArr.push(answers[i]);
    }
  }

  //loop through questions to check which ones are right
  for (let i = 0; i < answers.correct_answer.length; i++) {
    if (answers.correct_answer[i] == answersArr[i]) {
      // console.log("correct_answer");
      score += 1;
    }
  }

  //add users score to db
  let user = req.session.user;
  console.log(user)
  let result = await leaderBoardController.addUsersScore(user.username, score);

  res.render("finishedGame", {
    user: req.session.user,
    score: score,
    result: result,
  });
});

module.exports = router;
