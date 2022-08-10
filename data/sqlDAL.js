// sqlDAL is responsible to for all interactions with mysql for Membership
const User = require("../models/user").User;
const Result = require("../models/result").Result;
const STATUS_CODES = require("../models/statusCodes").STATUS_CODES;
require("dotenv").config();

const mysql = require("mysql2/promise");
const sqlConfig = {
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_DAL_PASSWORD,
  database: process.env.SQL_DATABSE,
  multipleStatements: false,
};

/**
 * @returns and array of user models
 */
exports.getAllUsers = async function () {
  users = [];

  const con = await mysql.createConnection(sqlConfig);

  try {
    let sql = `select * from users;`;

    const [userResults] = await con.query(sql);

    // console.log('getAllUsers: user results');
    // console.log(userResults);

    for (key in userResults) {
      let u = userResults[key];

      let sql = `select UserId, Role from UserRoles ur join Roles r on ur.roleid = r.roleid where ur.UserId = ${u.UserId}`;
      console.log(sql);
      const [roleResults] = await con.query(sql);

      // console.log('getAllUsers: role results');
      // console.log(roleResults);

      let roles = [];
      for (key in roleResults) {
        let role = roleResults[key];
        roles.push(role.Role);
      }
      users.push(new User(u.UserId, u.Username, u.Email, u.Password, roles));
    }
  } catch (err) {
    console.log(err);
  } finally {
    con.end();
  }

  return users;
};

/**
 * @returns and array of user models
 */
exports.getUsersByRole = async function (role) {
  users = [];

  const con = await mysql.createConnection(sqlConfig);

  try {
    let sql = `select * from Users u join UserRoles ur on u.userid = ur.userId join Roles r on ur.roleId = r.roleId where r.role = '${role}'`;

    const [userResults] = await con.query(sql);

    // console.log('getAllUsers: user results');
    // console.log(userResults);

    for (key in userResults) {
      let u = userResults[key];

      let sql = `select UserId, Role from UserRoles ur join Roles r on ur.roleid = r.roleid where ur.UserId = ${u.UserId};`;
      console.log(sql);
      const [roleResults] = await con.query(sql);

      // console.log('getAllUsers: role results');
      // console.log(roleResults);

      let roles = [];
      for (key in roleResults) {
        let role = roleResults[key];
        roles.push(role.Role);
      }
      users.push(new User(u.UserId, u.Username, u.Email, u.Password, roles, u.Status));
    }
  } catch (err) {
    console.log(err);
  } finally {
    con.end();
  }

  return users;
};

/**
 * @param {*} userId the userId of the user to find
 * @returns a User model or null if not found
 */
exports.getUserById = async function (userId) {
  let user = null;

  const con = await mysql.createConnection(sqlConfig);

  try {
    let sql = `select * from Users where UserId = ${userId}`;

    const [userResults] = await con.query(sql);

    for (key in userResults) {
      let u = userResults[key];

      let sql = `select UserId, Role from UserRoles ur join Roles r on ur.roleid = r.roleid where ur.UserId = ${u.UserId};`;
      console.log(sql);
      const [roleResults] = await con.query(sql);

      let roles = [];
      for (key in roleResults) {
        let role = roleResults[key];
        roles.push(role.Role);
      }
      user = new User(u.UserId, u.Username, u.Email, u.Password, roles, u.Status);
    }
  } catch (err) {
    console.log(err);
  } finally {
    con.end();
  }

  return user;
};

exports.deleteUserById = async function (userId) {
  let result = new Result();

  const con = await mysql.createConnection(sqlConfig);

  try {
    let sql = `delete from UserRoles where UserId = ${userId}`;
    let result = await con.query(sql);
    // console.log(result);

    sql = `delete from Users where UserId = ${userId}`;
    result = await con.query(sql);
    // console.log(result);

    result.status = STATUS_CODES.success;
    result.message = `User ${userId} delted!`;
  } catch (err) {
    console.log(err);
    result.status = STATUS_CODES.failure;
    result.message = err.message;
  } finally {
    con.end();
  }

  return result;
};

/**
 * @param {*} username the username of the user to find
 * @returns a User model or null if not found
 */
exports.getUserByUsername = async function (username) {
  let user = null;

  const con = await mysql.createConnection(sqlConfig);

  try {
    let sql = `select * from Users where Username = '${username}'`;
    console.log(sql);

    const [userResults] = await con.query(sql);

    for (key in userResults) {
      let u = userResults[key];

      let sql = `select UserId, Role from UserRoles ur join Roles r on ur.roleid = r.roleid where ur.UserId = ${u.UserId};`;
      console.log(sql);
      const [roleResults] = await con.query(sql);

      let roles = [];
      for (key in roleResults) {
        let role = roleResults[key];
        roles.push(role.Role);
      }
      user = new User(u.UserId, u.Username, u.Email, u.Password, roles, u.Status);
    }
  } catch (err) {
    console.log(err);
  } finally {
    con.end();
  }

  return user;
};

/**
 * @param {*} userId the userId of the user to find roles for
 * @returns an array of role names
 */
exports.getRolesByUserId = async function (userId) {
  results = [];

  const con = await mysql.createConnection(sqlConfig);

  try {
    let sql = `select UserId, Role from UserRoles ur join Roles r on ur.roleid = r.roleid where UserId = ${userId};`;

    const [results] = await con.query(sql);

    for (key in results) {
      let role = results[key];
      results.push(role.Role);
    }
  } catch (err) {
    console.log(err);
  } finally {
    con.end();
  }

  return results;
};

/**
 * @param {*} username
 * @param {*} hashedPassword
 * @param {*} email
 * @returns a result object with status/message
 */
exports.createUser = async function (username, hashedPassword, email, status) {
  let result = new Result();

  const con = await mysql.createConnection(sqlConfig);

  try {

    let sql = `insert into Users (Username, Email, Password, Status) values ('${username}', '${email}', '${hashedPassword}', '${status}')`;

    const userResult = await con.query(sql);

    let newUserId = userResult[0].insertId;

    sql = `insert into UserRoles (UserId, RoleId) values (${newUserId}, 1);`;
    await con.query(sql);

    result.status = STATUS_CODES.success;
    result.message = "Account Created with User Id: " + newUserId;
    result.data = newUserId;
    return result;
  } catch (err) {
    console.log(err);

    result.status = STATUS_CODES.failure;
    result.message = err.message;
    return result;
  } finally {
    con.end();
  }
};

/**
 *
 * @param {*} userId
 * @param {*} hashedPassword
 * @returns a result object with status/message
 */
exports.updateUserPassword = async function (userId, hashedPassword) {
  let result = new Result();

  const con = await mysql.createConnection(sqlConfig);

  try {
    let sql = `update Users set password = '${hashedPassword}' where userId = '${userId}'`;
    const userResult = await con.query(sql);

    // console.log(r);
    result.status = STATUS_CODES.success;
    result.message = "Account updated";
    return result;
  } catch (err) {
    console.log(err);

    result.status = STATUS_CODES.failure;
    result.message = err.message;
    return result;
  }
};

exports.addUsersScore = async function (username, score) {
  let result = new Result();

  const con = await mysql.createConnection(sqlConfig);

  try {
    let sql = `INSERT INTO leaderboard (Username,Score) VALUES('${username}', ${score});`;

    const leaderBoardResult = await con.query(sql);

    let newLeaderBoardId = leaderBoardResult[0].insertId;

    result.status = STATUS_CODES.success;
    result.message = "Account Created with User Id: " + newLeaderBoardId;
    result.data = newLeaderBoardId;
    return result;
  } catch (err) {
    console.log(err);

    result.status = STATUS_CODES.failure;
    result.message = err.message;
    return result;
  }
};

exports.getTopScores = async function () {
  let result = new Result();
  let results = [];

  const con = await mysql.createConnection(sqlConfig);

  try {
    let sql = `SELECT Username, Score FROM time4trivia.leaderboard
    ORDER BY score DESC
    LIMIT 10;`;

    const [leaderBoard] = await con.query(sql);

    for (key in leaderBoard) {
      let score = leaderBoard[key];
      results.push(score);
    }
  } catch (err) {
    console.log(err);

    result.status = STATUS_CODES.failure;
    result.message = err.message;
    return result;
  } finally {
    con.end();
  }
  return results;
};

/**
 * 
 * @param {*} userId 
 * @param {*} role
 * @returns a user with an updated role
 */
exports.updateUserRoleById = async function (userId, roleId) {
  let result = new Result();

  const con = await mysql.createConnection(sqlConfig);

  try {
    let sql = `update Users A, userroles B set B.RoleId = ${roleId} where A.UserId = ${userId} AND A.UserId = B.UserId;`;
    await con.query(sql);

    result.status = STATUS_CODES.success;
    result.message = 'Updated Role';
    return result;
  } catch (err) {
    console.log(err);
    result.status = STATUS_CODES.failure;
    result.message = err.message;
    return result;
  }
}

/**
 * 
 * @param {*} userId 
 * @param {*} status
 * @returns an updated status of a user
 */
 exports.updateUserStatus = async function (userId, status) {
  let result = new Result();

  const con = await mysql.createConnection(sqlConfig);

  try {
    let sql = `update Users U SET Status = '${status}' where U.UserId = ${userId};`;
    await con.query(sql);

    result.status = STATUS_CODES.success;
    result.message = 'Updated Role';
    return result;
  } catch (err) {
    console.log(err);
    result.status = STATUS_CODES.failure;
    result.message = err.message;
    return result;
  }
}