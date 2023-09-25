const router = require("express").Router();
const { User, Avatars, Pins } = require("../../models");

// GET discovery page
// Navigate to /discover and pull 20 pins to display along with username and avatar
router.get("/discover", async (req, res) => {
  try {
    // Grab all pins from the database
    const pins = await Pins.findAll();

    // Shuffles the pins array using  algorithm
    for (let i = pins.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pins[i], pins[j]] = [pins[j], pins[i]];
    }

    // Limits the rendered output to 20 pins
    const pinsData = pins.slice(0, 20).map((pin) => ({
      pinID: pin.id,
      pinTitle: pin.pinTitle,
      pinDescription: pin.pinDescription,
      pinLocation: pin.pinLocation,
      // take the pin.updatedAt and cut it off at the 4th space and only take the first half
      pinDate: pin.updatedAt
        ? pin.updatedAt.toString().split(" ").slice(0, 4).join(" ")
        : pin.updatedAt,
      timestamp: pin.updatedAt,
      pinUserID: pin.user_id,
      pinUsername: "",
      pinAvatar: "",
    }));

    // Take the creator userID for each pin and find the username that matches the userID
    for (let i = 0; i < pinsData.length; i++) {
      const userData = await User.findByPk(pinsData[i].pinUserID, {
        attributes: { exclude: ["password"] },
      });
      const user = userData.get({ plain: true });
      pinsData[i].pinUsername = user.username;

      // lookup the avatar src from the user's avatar_id
      const avatarData = await Avatars.findByPk(user.avatar_id);
      const avatar = avatarData.get({ plain: true });
      pinsData[i].pinAvatar = avatar.avatarsImage;
    }

    // Render the discovery page with the pinsData
    res.render("discovery-page", {
      styles: ["discovery-page"],
      scripts: ["discovery-page", "search-pin"],
      discoveryPins: pinsData,
      user: {
        id: req.session.user_id,
        isLoggedIn: req.session.logged_in,
      },
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET navigation to user's pin page
// Navigate to /pins/user and then redirect to /pins/user/:username once the username is known
router.get("/pins/user", async (req, res) => {
  try {
    // Log in Check, if not logged in, redirect to home page
    if (!req.session.logged_in) {
      return res.redirect("/");
    }

    // Find the user's username by the session user_id
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
    });
    const user = userData.get({ plain: true });

    // Redirect to /pins/user/:username
    res.redirect(`/pins/user/${user.username}`);
  } catch (err) {
    // Redirect to 404 page on error
    return res.status(404).json(err);
  }
});

// GET navigation to user's editprofile page
// Navigate to /editprofile and then redirect to /editprofile/:username once the username is known
router.get("/editprofile", async (req, res) => {
  try {
    // Lookup username by session userId
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
    });
    const user = userData.get({ plain: true });

    // Redirect to /editprofile/:username
    res.redirect(`/editprofile/${user.username}`);
  } catch (err) {
    // Redirect to 404 page on error
    return res.status(404).json(err);
  }
});

// GET specific user's pin page
// Navigate to /pins/user/:username
router.get("/pins/user/:username", async (req, res) => {
  try {
    // Find the user's username by the session user_id
    const user = await User.findOne({
      where: {
        username: req.params.username,
      },
      attributes: { exclude: ["password"] },
    });

    // If the user does not exist, redirect to home page
    if (!user) {
      console.error(
        `The user with the provided username "${req.params.username}" does not exist.`
      );
      return res.redirect("/");
    }

    // Find the user's pins
    const pins = await Pins.findAll({
      where: { user_id: user.id },
    });


  // if there is no pinID, redirect to home page
  if (!pins[0] === "") {
    return res.redirect("/");
  }


      // Create an array of the pins data
      var pinsData = pins.map((pin) => ({
        pinID: pin.id,
        pinTitle: pin.pinTitle,
        pinDescription: pin.pinDescription,
        // Take the pin.updatedAt and cut it off at the 4th space and only take the first half
        pinDate: pin.updatedAt
          ? pin.updatedAt.toString().split(" ").slice(0, 4).join(" ")
          : pin.updatedAt,
      }));
    
    

    // Break the saved_pins json object down and take only the pinId and put it into savedPinsData
    const savedPins = user.saved_pins;

    // Only do the next part if the user has saved pins
    if (savedPins && savedPins !== "") {
      const savedPinsJSON = JSON.parse(savedPins);

      // For each in savedPinsJSON, grab the pinId and put into array
      var savedPinsArray = [];
      for (let i = 0; i < savedPinsJSON.length; i++) {
        savedPinsArray.push(savedPinsJSON[i].pinId);
      }

      // Go through each pin in the savedPinsArray and find the pin that matches the pinId and put it into savedPinsData
      var savedPinsData = [];
      for (let i = 0; i < savedPinsArray.length; i++) {
        const pin = await Pins.findByPk(savedPinsArray[i]);
        // Map the data required for the discovery pins to savedPinsData
        const pinData = pin.get({ plain: true });
        savedPinsData.push({
          pinID: pinData.id,
          pinTitle: pinData.pinTitle,
          pinDescription: pinData.pinDescription,
          pinLocation: pinData.pinLocation,
          // Take the pin.updatedAt and cut it off at the 4th space and only take the first half
          pinDate: pinData.updatedAt
            ? pinData.updatedAt.toString().split(" ").slice(0, 4).join(" ")
            : pinData.updatedAt,
          timestamp: pinData.updatedAt,
          pinUserID: pinData.user_id,
          pinUsername: "",
          pinAvatar: "",
        });
      }

      // Find the creator of the pinID and get their username
      for (let i = 0; i < savedPinsData.length; i++) {
        const userData = await User.findByPk(savedPinsData[i].pinUserID, {
          attributes: { exclude: ["password"] },
        });
        const user = userData.get({ plain: true });
        savedPinsData[i].pinUsername = user.username;

        // Lookup the avatar src from the user's avatar_id
        const avatarData = await Avatars.findByPk(user.avatar_id);
        const avatar = avatarData.get({ plain: true });
        savedPinsData[i].pinAvatar = avatar.avatarsImage;
      }
    }

    // Render the personal page with the pinsData and savedPinsData
    res.render("personal-page", {
      styles: ["personal-page", "discovery-page"],
      scripts: ["personal-page", "discovery-page", "search-pin"],
      mypins: pinsData,
      discoveryPins: savedPinsData,
      user: {
        id: req.session.user_id,
        isLoggedIn: req.session.logged_in,
      },
    });
  } catch (error) {
    // Redirect to 404 page on error
    return res.status(404).json(error);
  }
});

// GET edit profile page
// Navigate to /editprofile/:username
router.get("/editprofile/:username", async (req, res) => {
  try {
    // lookup one user by username
    const userData = await User.findOne({
      where: {
        username: req.params.username,
      },
      attributes: { exclude: ["password"] },
    });
    const user = userData.get({ plain: true });

    // verify that the user exists in the database.
    if (!user) {
      console.error(
        `The user with the provided username "${req.params.username}" does not exist.`
      );
      return res.redirect("/");
    }

    // Confirm that the specified user is the same as the logged in user
    const userSession = req.session.user_id;
    const userLoggedIn = req.session.logged_in;

    if (userSession !== user.id || userLoggedIn !== 1) {
      return res.status(400).json({
        message: `You are not authorized to edit this user's profile.`,
      });
    }

    // Pull from the avatar table the avatar image location that matches the user's avatar id
    const avatarData = await Avatars.findByPk(user.avatar_id);
    const avatar = avatarData.get({ plain: true });

    // Pull from the avatar table all the avatar images for the modal
    const avatarList = await Avatars.findAll();
    const avatars = avatarList.map((avatar) => avatar.get({ plain: true }));

    // Render the edit profile page with the user's data
    res.render("user-profile", {
      layout: "main",
      styles: ["user-profile"],
      scripts: ["user-profile"],
      avatar,
      avatars,
      user: {
        ...user,
        id: req.session.user_id,
        isLoggedIn: req.session.logged_in,
      },
    });
  } catch (err) {
    res.status(404).json(user);
  }
});

module.exports = router;