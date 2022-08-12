// mongoDAL is responsible to for all interactions with mongodb for the trivia game
const e = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const Result = require('../models/result').Result;
const STATUS_CODES = require('../models/statusCodes').STATUS_CODES;

const URL = "mongodb://localhost:27017";
const client = new MongoClient(URL);

const dbName = "Web-Security-Questions";
const db = client.db(dbName);
const pendingCollection = db.collection("PendingQuestions");
const triviaCollection = db.collection("Questions");

exports.getAllQuestions = async (collection) => {
  let result;
  const questions = db.collection(`${collection}`);
  client.connect();
  try {
    result = await questions.find({}).toArray();
  } catch (err) {
    console.log(err);
  }
  client.close();
  return result;
};

exports.getOneQuestion = async (collection, id) => {
  let result;
  const question = db.collection(`${collection}`);
  client.connect();
  try {
    result = await question.find({_id: ObjectId(`${id}`)}).toArray();
  } catch (err) {
    console.log(err);
  }
  client.close();
  return result;
}

exports.addTrivia = async (trivia) => {
  let result;
  client.connect();
  try {
    if (trivia == undefined) {
      return new Result(STATUS_CODES.failure, 'Trivia Format Invalid');
    } else {
      result = await pendingCollection.insertOne(trivia, (err, res) => {
        if (err) {
          console.log(err);
          throw err;
        }
        client.close();
      });
      return new Result(STATUS_CODES.success, 'Valid Trivia Object', trivia)
    }
  } catch (err) {
    console.log(err);
    return result;
  }
}

exports.updateApprovalOfQuestion = async (triviaObj) => {
  let result;
  client.connect();
  try {
    if (triviaObj == undefined) {
      return new Result(STATUS_CODES.failure, 'Trivia Format Invalid');
    } else {
      result = await triviaCollection.insertOne(triviaObj, (err, res) => {
        if (err) {
          console.log(err);
          throw err;
        }
        client.close();
      });
      return new Result(STATUS_CODES.success, 'Valid Trivia Object', triviaObj)
    }
  } catch (err) {
    console.log(err);
    return result;
  }
}