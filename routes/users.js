const express = require("express");
const router = express.Router();

const userController = require('../controllers/userController');
const questionController = require('../controllers/questionController');
const STATUS_CODES = require('../models/statusCodes').STATUS_CODES;

const listArray = require('../public/js/blacklist.js')

const scriptRemoval =(script)=>{

}

const stringCheck = (text) => {
  // const list = ["--", ";", '"', "<script>", "</script>", "UNION", "SELECT", "UPDATE", "DELETE", "WHERE","INSERT"];
  const list = listArray.list;
  console.log(list);
  let word = text;

  for (let i = 0; i < list.length; i++) {
    if (word.includes(list[i])) {
      word = word.replace(list[i], "");
    }else{
      continue;
    }
  }
  return word;
};

router.get("/register", function (req, res, next) {
  res.render("register", { title: "Time 4 Trivia", error: "" });
});

router.post("/register", async function (req, res, next) {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let status = String('enabled');


  let username2 = stringCheck(username);
  console.log(username2)
  let email2 = stringCheck(email);
  let password2 = stringCheck(password);

  let result = await userController.createUser(username2, email2, password2,status);


  if (result?.status == STATUS_CODES.success) {
    res.redirect("/u/login");
  } else {
    res.render("register", {
      title: "Time 4 Trivia",
      error: "Register Failed",
    });
  }
});

router.get("/login", function (req, res, next) {
  res.render("login", { title: "Time 4 Trivia", error: "" });
});

router.post("/login", async function (req, res, next) {
  // Need to get the posted username and password
  let username = req.body.username;
  let password = req.body.password;

  let usernameTwo = stringCheck(username);
  let passwordTwo = stringCheck(password);

  let result = await userController.login(usernameTwo, passwordTwo);

  if (result?.status == STATUS_CODES.success) {
    req.session.user = {
      userId: result.data.userId,
      username: result.data.username,
      isAdmin: result.data.roles.includes("admin"),
    };
    res.redirect("/");
  } else {
    res.render("login", {
      title: "Time 4 Trivia",
      error: "Invalid Login. Please try again.",
    });
  }
});

router.get("/logout", function (req, res, next) {
  // Clear session information?!?
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
  });

  res.redirect("/");
});

router.get("/profile", function (req, res, next) {
  res.render("profile", {
    title: "Time 4 Trivia",
    user: req.session.user,
    error: "",
  });
});

router.post("/profile", async function (req, res, next) {
  let current = stringCheck(req.body.currentPassword) ;
  let new1 = stringCheck(req.body.newPassword);
  let new2 = stringCheck(req.body.newPassword);

  if (new1 != new2) {
    res.render("profile", {
      title: "Time 4 Trivia",
      user: req.session.user,
      error: "Password do not match",
    });
  } else {
    // console.log(`Changing passwor for userId ${req.session.user?.userId}`);
    let result = await userController.updateUserPassword(
      req.session.user.userId,
      current,
      new1,
      new2
    );
    if (result.status == STATUS_CODES.success) {
      res.redirect("/u/login");
    } else {
      res.render("profile", {
        title: "Time 4 Trivia",
        user: req.session.user,
        error: "Password update failed",
      });
    }
  }
});

router.get("/add-new-trivia", async function (req, res, next) {
  if (!req.session.user) {
    res.redirect("/");
  } else {
    res.render("addTrivia", { user: req.session.user });
  }
})

router.post("/add-new-trivia", async function (req, res, next) {
  let trivia = {
    question: stringCheck(req.body.question) ,
    correct_answer: stringCheck(req.body.correct),
    incorrect_answers: req.body.incorrect
  }
  let result = await questionController.addTrivia(trivia);

  if (result?.status == STATUS_CODES.success) {
    res.redirect("/");
  } else {
    console.log("error")
  }
})

module.exports = router;
