const sqlDAL = require("../data/sqlDAL");

const Result = require("../models/result").Result;
const STATUS_CODES = require("../models/statusCodes").STATUS_CODES;

exports.addUsersScore = async function (username, score) {
  let result = await sqlDAL.addUsersScore(username, score);

  return result;
};

exports.getLeaderBoard = async function () {
  let result = await sqlDAL.getTopScores();

  return result;
};
