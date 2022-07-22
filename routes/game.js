const express = require('express');
const router = express.Router();
const questionController = require("../controllers/questionController");


router.get('/play', async function(req, res, next) {
  // TODO: Implement Game
  let results = await questionController.getAllQuestions();
  console.log("mongo query")
  
  
  res.render('play', {user: req.session.user, questions: results});
});

module.exports = router;