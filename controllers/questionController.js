const mongoDAL = require("../data/mongoDAL");

exports.getAllQuestions = async (collection, randomize) => {
  let results = await mongoDAL.getAllQuestions(collection);
  let questions = formatQuestion(results);

  if (randomize == false) {
    let questions = await mongoDAL.getAllQuestions(collection);

    return questions;
  }

  return questions;
};

exports.getOneQuestion = async (collection, id) => {
  let question = await mongoDAL.getOneQuestion(collection, id);

  return question;
}

exports.updateApprovalOfQuestion = async (triviaObj) => {
  let question = await mongoDAL.updateApprovalOfQuestion(triviaObj);

  return question;
}

const formatQuestion = (questions) => {
  let qArray = [];

  questions.forEach((element) => {
    let data = {
      question: element.question,
      correctAnswer: element.correct_answer,
      answers: randomQuestions(
        element.incorrect_answers,
        element.correct_answer
      ),
    };
    qArray.push(data);
  });

  return qArray;
};

const randomQuestions = (incorrectAnswers, correctAnswer) => {
  let answers = [];

  answers.push(correctAnswer);

  incorrectAnswers.forEach((item) => {
    answers.push(item);
  });

  for (let i = answers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [answers[i], answers[j]] = [answers[j], answers[i]];
  }

  return answers;
};

exports.addTrivia = (trivia) => {
  return mongoDAL.addTrivia(trivia);
}