const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const questionController = require('../controllers/questionController');
const STATUS_CODES = require('../models/statusCodes').STATUS_CODES;

// All Admin Routes should only be accessble to logged in Admins!

router.get('/users/:role', async function (req, res, next) {
  let role = req.params.role;
  if (!req.session.user || !req.session.user.isAdmin) {
    res.redirect('/');
  } else {
    let users = await userController.getUsers(role);
    // let statuses = await userController.getUsersStatus();

    res.render('users', { title: 'Time 4 Trivia', currentUser: req.session.user, users: users });
  }
});

router.get('/pending-trivia', async function (req, res, next) {
  if (!req.session.user || !req.session.user.isAdmin) {
    res.redirect('/');
  } else {
    let results = await questionController.getAllQuestions('PendingQuestions', false);
    console.log(results);
    res.render("pendingQuestions", { user: req.session.user, questions: results });
  }
})

router.post('/pending-trivia', async function (req, res, next) {
  if (!req.session.user || !req.session.user.isAdmin) {
    res.redirect('/');
  } else {
    if (req.body.approve) {
      let triviaObjectBSON = await questionController.getOneQuestion('PendingQuestions', req.body._id);
      let triviaObjectString = JSON.stringify(triviaObjectBSON[0]);
      let triviaObject = JSON.parse(triviaObjectString);

      let addApproveProp = {
        approval: "approved"
      }

      Object.assign(triviaObject, addApproveProp);

      await questionController.updateApprovalOfQuestion(triviaObject);
      res.redirect('/a/pending-trivia');
    } else if (req.body.deny) {
      let triviaObjectBSON = await questionController.getOneQuestion('PendingQuestions', req.body._id);
      let triviaObjectString = JSON.stringify(triviaObjectBSON[0]);
      let triviaObject = JSON.parse(triviaObjectString);

      let addDenyProp = {
        approval: "denied"
      }

      Object.assign(triviaObject, addDenyProp);

      await questionController.updateApprovalOfQuestion(triviaObject);
      res.redirect('/a/pending-trivia');
    } else {
      console.log('error');
    }
  }
});

router.get('/delete/:userId', async function (req, res, next) {
  let userId = req.params.userId;

  await userController.deleteUserById(userId);

  res.redirect('/');
});

router.get('/users/profile/:userId', async function (req, res, next) {
  if (!req.session.user || !req.session.user.isAdmin) {
    res.redirect('/');
  } else {
    if (req.params.userId == req.session.user.userId) {
      console.log('cannot update yourself')
      res.redirect('/a/users/user')
    } else {
      let profile = await userController.getUserById(req.params.userId);
      console.log(profile)
      res.render('userprofile', { title: 'Time 4 Trivia', profile: profile })
    }
  }
})

router.post('/users/profile/:userId', async function (req, res, next) {
  if (!req.session.user || !req.session.user.isAdmin) {
    res.redirect('/');
  } else {
    let newRole = await userController.updateUserRoleById(req.params.userId, req.body.role);
    let newStatus = await userController.updateUserStatus(req.params.userId, req.body.status);
    console.log(newRole, newStatus)
    // console.log(req.body.role)

    if (newRole.status == STATUS_CODES.success && newStatus.status == STATUS_CODES.success) {
      console.log('it was a success');
      res.redirect('/a/users/user');
    } else {
      console.log('there was an error');
      res.render('userprofile', { title: 'Time 4 Trivia', error: 'Error updating profile' });
    }
  }
});

module.exports = router;
