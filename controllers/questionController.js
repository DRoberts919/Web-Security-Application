const mongoDAL = require("../data/mongoDAL");

exports.getAllQuestions = async ()=>{
    let results = await mongoDAL.getAllQuestions();
    console.log(results);
    return results
}