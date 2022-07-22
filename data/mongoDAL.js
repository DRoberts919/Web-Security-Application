// mongoDAL is responsible to for all interactions with mongodb for the trivia game
const { MongoClient } = require("mongodb");

const URL = "mongodb://localhost:27017";
const client = new MongoClient(URL);

const dbName = "Web-Security-Questions";
const db = client.db(dbName);
const collection = db.collection("Questions");

exports.getAllQuestions = async () => {
  let result;
  client.connect();
  try {
    result = await collection.find({}).toArray();
  } catch (err) {
    console.log(err);
  }
  client.close();
  return result;
};
