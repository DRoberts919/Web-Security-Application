function validateForm() {
  let x = document.getElementById("registerEmail").value;
  let form = document.getElementById("resgisterForm");
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (x == "") {
    alert("email must be filled out");
    return false;
  } else if (re.test(String(x).toLocaleLowerCase()) == false) {
    alert("Email must be valid");
    return false;
  } else {
    form.submit();
  }
}

const stringCheck = (text) => {
  const list = ["--", ";", '"', "<script>", "</script>", "UNION", "SELECT"];
  let word = text;

  for (let i = 0; i < list.length; i++) {
    if (word.includes(list[i])) {
      word = word.replace(list[i], "");
    }
  }

  //TODO work on removing all text in between script tags
  return word;
};
