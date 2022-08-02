const express = require("express");
const router = express.Router();
const leaderBoardController = require("../controllers/leaderBoardController");

router.get("/", function (req, res, next) {
  res.render("index", { title: "Time 4 Trivia", user: req.session.user });
});

router.get("/leaderboard", async function (req, res, next) {
  let leaders = await leaderBoardController.getLeaderBoard();
  console.log(leaders);

  res.render("leaderboard", {
    title: "Time 4 Trivia",
    user: req.session.user,
    leaders: leaders,
  });
});

module.exports = router;
