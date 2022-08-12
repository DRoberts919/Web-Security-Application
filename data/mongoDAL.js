// mongoDAL is responsible to for all interactions with mongodb for the trivia game
const e = require("express");
const { MongoClient } = require("mongodb");
const Result = require('../models/result').Result;
const STATUS_CODES = require('../models/statusCodes').STATUS_CODES;
require("dotenv").config();

const URL = process.env.MONGO_URL;
//const URL = "mongodb://localhost:27017";
const client = new MongoClient(URL);

const dbName = process.env.MONGO_DBNAME;
const db = client.db(dbName);
const pendingCollection = db.collection("PendingQuestions");

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

exports.addTrivia = async (trivia) => {
  let result;
  client.connect();
  try {
    if (trivia == undefined) {
      return new Result(STATUS_CODES.failure, 'Trivia Format Invalid');
    } else {
      result = await pendingCollection.insertOne(trivia, (err, res) => {
        if(err) {
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

exports.denyTrivia = async (trivia) => {
  console.log('denied');
}