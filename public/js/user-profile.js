$(document).ready(function () {
    $("#editsecurity-password").popover();
    $("#editprofile-username").popover();
    var currentUserInfo = {
      username: $("#editprofile-username").val(),
      firstName: $("#editprofile-firstname").val(),
      lastName: $("#editprofile-lastname").val(),
      aboutme: $("#editprofile-aboutme").val(),
      email: $("#editsecurity-email").val(),
      id: $("#editsecurity-id").val(),
    };
  
    // Avatar Modal //
    // set up the avatar selection modal show and hide
    $("#changeAvatarBtn").click(function (e) {
      e.preventDefault();
      $("#avatarChoiceModal").modal("show");
    });
  
    // when you click on an avatar image option, change the avatar image and reload the page
    $(".avatar-image-option").on("click", function () {
      const avatarId = $(this).attr("data-avatar-id");
  
      // Send a PUT request to change the user's avatar id
      $.ajax({
        url: `/api/user/editprofile/${currentUserInfo.username}`,
        data: {
          avatar_id: avatarId,
        },
        type: "PUT",
        success: function (response) {
          console.log("updated user");
          $.ajax({
            url: `/api/avatars/${avatarId}`,
            type: "GET",
            success: function (response) {
              // change the avatar image options
              $("#editprofile-avatar-image").attr(
                "src",
                `${response.avatarsImage}`
              );
              $("#user-profile-pic").attr("src", `${response.avatarsImage}`);
  
              // display a success alert
              addAlertToPage(
                "alert-success",
                "Success!",
                " Your avatar has been successfully changed.",
                "#editprofile-submitBtn"
              );
              $("#avatarChoiceModal").modal("hide");
            },
            error: function (xhr) {
              console.log(xhr);
              if (xhr.status === 500) {
                addAlertToPage(
                  "alert-danger",
                  "Error!",
                  " There was an error changing your avatar.",
                  "#editprofile-submitBtn"
                );
              }
            },
          });
        },
      });
    });
    // Avatar //
  
    // User Profile //
    $(
      "#editprofile-username, #editprofile-firstname, #editprofile-lastname, #editprofile-aboutme"
    ).on("input", function () {
      if (
        $("#editprofile-username").val() !== currentUserInfo.username ||
        $("#editprofile-firstname").val() !== currentUserInfo.firstName ||
        $("#editprofile-lastname").val() !== currentUserInfo.lastName ||
        $("#editprofile-aboutme").val() !== currentUserInfo.aboutme
      ) {
        // if active, enable the submit button and change its color
        $("#editprofile-submitBtn").removeAttr("disabled");
      } else {
        $("#editprofile-submitBtn").attr("disabled", true);
      }
    });
  
    // If you submit the form, send a PUT request to update the user's info
    $("#editprofile-form").submit(function (event) {
      var form = $("#editprofile-form")[0];
  
      // If there is an invalid form, prevent the submit button from working and show the validation notes
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        form.classList.add("was-validated");
      }
      // Otherwise, if the form is valid, send a PUT request with the info
      else {
        event.preventDefault();
  
        // Collect the new information to validate uniqueness and send in the PUT request
        const user = {
          username: $("#editprofile-username").val().trim(),
          firstName: $("#editprofile-firstname").val().trim(),
          lastName: $("#editprofile-lastname").val().trim(),
          aboutme: $("#editprofile-aboutme").val().trim(),
        };
  
        if (user.username !== currentUserInfo.username) {
          // Send a GET request to check the username
          $.ajax({
            url: `/api/user/checkusername/${user.username}`,
            type: "GET",
            success: function (response) {
              // If the username is not unique, show an error message
              // If the username doesnt exist or is mine, send the PUT request to change user profile info
              if (response) {
                addAlertToPage(
                  "alert-danger",
                  "Username already exists!",
                  " Please choose a different username.",
                  "#editprofile-submitBtn"
                );
                // End the click event function
                return;
              }
            },
            error: function (xhr) {
              console.log(xhr);
              if (xhr.status === 500) {
                addAlertToPage(
                  "alert-danger",
                  "Error!",
                  " There was an error checking the username.",
                  "#editprofile-submitBtn"
                );
              }
            },
          });
        }
  
        $.ajax({
          url: `/api/user/editprofile/${currentUserInfo.username}`,
          data: {
            first_name: user.firstName,
            last_name: user.lastName,
            username: user.username,
            about_me: user.aboutme,
          },
          type: "PUT",
          success: function (response) {
            // If the update is successful, show the modal to user with a success message
            // Redirect to the user's profile page
            window.location.href = `/editprofile/${user.username}`;
          },
          error: function (xhr) {
            console.log(xhr);
            if (xhr.status === 500) {
              addAlertToPage(
                "alert-danger",
                "Error!",
                " There was an error updating your profile.",
                "#editprofile-submitBtn"
              );
  
              if (xhr.status === 401) {
                //redirect to landing page
                window.location.href = `/`;
              }
            }
          },
        });
      }
    });
  
    // User Profile end //
  
    // Account security //
  
    //Enable the confirm button if the passwords are equal length and greater than 7 characters
    $("#editsecurity-password, #editsecurity-confirmpassword").on(
      "input",
      function () {
        if (
          $("#editsecurity-password").val().length > 7 &&
          $("#editsecurity-confirmpassword").val().length > 7 &&
          $("#editsecurity-password").val().length ===
            $("#editsecurity-confirmpassword").val().length
        ) {
          // if active, enable the submit button and change its color
          $("#editsecurity-submitBtn").removeAttr("disabled");
        } else {
          $("#editsecurity-submitBtn").attr("disabled", true);
        }
      }
    );
  
    // checking to see password is the same and valid
    $("#editsecurity-form").submit(function (event) {
      var newpassword = $("#editsecurity-password").val().trim();
      var confirmPassword = $("#editsecurity-confirmpassword").val().trim();
  
      if (
        newpassword !== confirmPassword ||
        !validatePassword(newpassword) ||
        !validatePassword(confirmPassword)
      ) {
        event.preventDefault();
        event.stopPropagation();
        if (newpassword !== confirmPassword) {
          addAlertToPage(
            "alert-danger",
            "Passwords do not match!",
            " Please enter matching passwords.",
            "#editsecurity-submitBtn"
          );
        }
        if (!validatePassword(newpassword)) {
          addAlertToPage(
            "alert-danger",
            "Password is invalid!",
            " Please enter a valid password.",
            "#editsecurity-submitBtn"
          );
        }
      } else {
        // if the passwords match, send a PUT request to update the user's password
        $.ajax({
          url: `/api/user/editsecurity/${currentUserInfo.username}`,
          data: {
            password: newpassword,
          },
          type: "PUT",
          success: function (response) {
            console.log("updated user");
          },
          error: function (xhr) {
            console.log(xhr);
            console.log("error updating user");
            if (xhr.status === 400) {
              var response = JSON.parse(xhr.responseText);
              if (
                response.message ===
                `The user with the provided id ${currentUserInfo.username} does not exist. Please try again.`
              ) {
                alert("The user does not exist. Please try again.");
              }
            }
            if (xhr.status === 404) {
              // Redirect to home page if API route not found
              window.location.href = "/";
            }
          },
        });
      }
    });
  
    // if the user clicks the delete button, it pulls up a confirmation modal
    $("#editsecurity-deleteBtn").click(function (e) {
      e.preventDefault();
      // show the modal
      $("#deleteAccountModal").modal("show");
    });
  
    // if the user clicks the deleteAccountModal confirm button, it sends a DELETE request to delete the user
    $("#deleteAccountModal-confirmBtn").click(async function (e) {
      e.preventDefault();
      // send a DELETE request to delete the user
      await $.ajax({
        url: `/api/user/delete/${currentUserInfo.username}`,
        type: "DELETE",
        success: function (response) {
          console.log("deleted user");
        },
        error: function (xhr) {
          console.log(xhr);
          console.log("error deleting user");
          if (xhr.status === 404) {
            // Redirect to home page if API route not found
            document.location.replace("/");
          }
        },
      });
  
      // call the logout api
      await $.ajax({
        url: "/api/user/logout",
        type: "POST",
        success: function (response) {
          console.log("logged out");
        },
        error: function (xhr) {
          console.log(xhr);
          console.log("error logging out");
        },
      });
      // redirect to the homepage
      document.location.replace("/");
    });
  
    // account security end//
    
    // create the alert element
    function addAlertToPage(
      alertClass,
      alertBoldMessage,
      alertMessage,
      disableButtonID
    ) {
      var myAlert = document.createElement("div");
      myAlert.className = `alert ${alertClass} alert-dismissible fade show editprofile-alert`;
      myAlert.setAttribute("role", "alert");
      myAlert.innerHTML = `
              <strong>${alertBoldMessage}</strong> ${alertMessage}
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              `;
      $("#editprofile-alert-area").append(myAlert);
      // disable the confirm button
      $(`${disableButtonID}`).attr("disabled", true);
  
      // create a timer to fade out the alert
      setTimeout(function () {
        $(".alert").alert("close");
      }, 5000);
    }
  
    // validate the password
    function validatePassword(password) {
      const userPassword = password.trim();
      const passwordRegex =
        /^(?=.*[0-9])(?=.*[~`!@#$%^&*()\-=_+[\]{};':"\\|,.<>/?])(?=.*[A-Z])(?=.*[a-z]).{8,128}$/;
  
      if (!passwordRegex.test(userPassword)) {
        return false;
      } else {
        return true;
      }
    }
   
  });