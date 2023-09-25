$(document).ready(function () {
    // Load the username and avatar to the navbar.
    if ($("#nav-user-dropdown").length) {
      // get the user's session data
      $.ajax({
        url: "/api/user/session/lookup",
        method: "GET",
      }).then(function (data) {
        if (data) {
          // get the avatar info for the users avatar_id
          $.ajax({
            url: `/api/avatars/${data.avatar_id}`,
            method: "GET",
          }).then(function (avatarData) {
            // if the user is logged in, make the text in the logout dropdown your username and your avatar picture src
            $("#user-profile-pic").attr("src", avatarData.avatarsImage);
            $("#user-username").text(`Hi, ${data.username}`);
          });
        }
      });
    }
  });