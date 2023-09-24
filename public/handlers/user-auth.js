const signupBtn = $("#signup-btn");
const signupUsername = $("#signup-username");
const signupEmail = $("#signup-email");
const signupPassword = $("#signup-password");
const loginBtn = $("#login-btn");
const logoutBnt = $("#logout-btn");

async function signupClick(e) {
  e.preventDefault();

  const userData = {
    username: signupUsername.val().trim(),
    email: signupEmail.val().trim().toLowerCase(),
    password: signupPassword.val().trim(),
  };

  const response = await fetch ("/api/user/signup", {
    method: "POST",
    body: JSON.stringify(userData),
    headers: {"Content-Type": "application/json"},
  });

  if (response.ok) {
    $(".body-modal").removeAttr("cd-signin-modal--is-visible");
    document.location.replace("/");
    alert(`Hello ${userData.username}! Have fun traveling!`);
  } else if (response.status === 422) {
    const responseJson = await response.json();

    if(responseJson.errorCode === "usernameExists") {
      showErrorMessage(signupUsername, ".username-error-422");
    } else if (responseJson.errorCode === "emailExists") {
      showErrorMessage(signupEmail, ".email-error-422");
  } else if (response.status === 500) {
      showErrorMessage(signupPassword, ".error-500");
  }
}}

async function logInClick(e) {
  e.preventDefault();

  const userData = {
    email: $('#signin-email').val().trim().toLowerCase(),
    password: signupPassword.val().trim(),
  }

  if (userData.email.length < 5) {
    showErrorMessage($('signin-email'), 'login-short-email');
    return;
  }

  const response = await fetch('/api/user/login', {
    method: "POST",
    body: JSON.stringify(userData),
    headers: {"Content-Type": "application/json"},
  });

  if (response.ok) {
    const responseData = await response.json();
    console.log("responseData", responseData);
    const userId = responseData.userId;
    console.log("userId", userId);
    $("body.modal").removeAttr("cd-signin-modal--is-visible");
    const responseUsername = await fetch(`api/user/${userId}`, {
      method: "GET",
      headers: {"Content-Type": "application/json"},
    });
    const responseDataUsername = await responseUsername.json();
    console.log("responseDataUsername", responseDataUsername);
    const username = responseDataUsername.username;
    console.log("username", username);
    document.location.replace(`/pins/user/${username}`);
  } else if (response.status === 404) {
    showErrorMessage($("#signin-password"), '.error-404');
  } else if (response.status === 500) {
    showErrorMessage($("#signin-password"), '.error-500');
  }
}

async function logOutClick(e) {
  e.preventDefault();

  const response = await fetch("/api/user/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json"},
  });

  if (response.ok) {
    document.location.replace("/");
  } else if (response.status === 404) {
    alert("User not found");
  } else {
    alert(
      "Server side error. Please wait..."
    );
  }
}

function validateSignupUsername() {
  const bool = validateUsername();

  if (!bool) {
    showErrorMessage(signupUsername, ".username-validation");
  }
}

function validateUsername() {
  const username = signupUsername.val().trim();
  const alphanumericRegex = /^[a-zA-Z0-9]+$/;

  if (
    username.length < 3 ||
    username.length > 20 ||
    !alphanumericRegex.test(username)
  ) {
    return false;
  } else {
    return true;
  }
}

function validateSignupEmail() {
  const bool = validateEmail();

  if(!bool) {
    showErrorMessage(signupEmail, ".email-validation");
  }
}

function validateEmail() {
  const userEmail = signupEmail.val().trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(userEmail)) {
    return false;
  } else {
    return true;
  }
}

function validateSignupPassword() {
  const bool = validatePassword();

  if(!bool) {
    showErrorMessage(signupPassword, ".password-validation");
  }
}

function validatePassword() {
  const userPassword = signupPassword.val().trim();
  const passwordRegex = /^(?=.*[0-9])(?=.*[~`!@#$%^&*()\-=_+[\]{};':"\\|,.<>/?])(?=.*[A-Z])(?=.*[a-z]).{8,128}$/;

  if (!passwordRegex.test(userPassword)) {
    return false;
  } else {
    return true;
  }
}

function showErrorMessage(element, siblingClass) {
  element.siblings(siblingClass)
  .addClass("cd-signin-modal__error--is-visible");

  element.on("focus", () => {
    element.siblings(siblingClass).removeClass("cd-signin-modal__error--is-visible")
  });
}

function checkSignupFormCompletion() {
  const username = validateUsername();
  const userEmail = validateEmail();
  const userPassword = validatePassword();

  if (username && userEmail && userPassword) {
    signupBtn.removeAttr("disabled");
  }

  if (!username || !userEmail || !userPassword) {
    signupBtn.attr("disabled", "disabled");
  }
}

loginBtn.on("click", (e) => handleLogInClick(e));
signupBtn.on("click", (e) => handleSignUpClick(e));
logoutBnt.on("click", (e) => handleLogOutClick(e));
signupUsername.on("blur", validateSignupUsername);
signupEmail.on("blur", validateSignupEmail);
signupPassword.on("blur", validateSignupPassword);
$(".signup-input").on("keyup", checkSignupFormCompletion);