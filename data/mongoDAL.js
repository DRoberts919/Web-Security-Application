// mongoDAL is responsible to for all interactions with mongodb for the trivia game
const e = require("express");
const { MongoClient } = require("mongodb");
const Result = require('../models/result').Result;
const STATUS_CODES = require('../models/statusCodes').STATUS_CODES;

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

exports.addTrivia = async (trivia) => {
  let result;
  client.connect();
  try {
    if (trivia == undefined) {
      return new Result(STATUS_CODES.failure, 'Trivia Format Invalid');
    } else {
      result = await collection.insertOne(trivia, (err, res) => {
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
