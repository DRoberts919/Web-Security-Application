const mongoDAL = require("../data/mongoDAL");

exports.getAllQuestions = async ()=>{
    let results = await mongoDAL.getAllQuestions();
    let questions = formatQuestion(results)
    return results
}

const formatQuestion = (questions)=>{
    let qArray = []

    qArray.forEach(element => {
        let data = {
            question: element.question,
            correctAnswer: element.correct_answer,
            answers: randomQuestions(element.incorrect_answers, element.correct_answers) 
        }
    });

    return qArray
}

const randomQuestions = (incorrectAnswers,correctAnswer)=>{
    let answers = []
    

}