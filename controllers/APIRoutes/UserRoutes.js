const router = require("express").Router();
const bcrypt = require("bcrypt");
const { User, Avatar, Post } = require("../../models"); 

// USER AUTHENTICATION ROUTES //
// set up a route for users to sign up.
router.post("/signup", async (req, res) => {
    try {
        // verify that there is no user in the database with the provided email
        const userExists = await User.findOne({
            where: {
                email: req.body.email.toLowerCase().trim(),
            },
        });

        if (userExists) {
            return res.status(422).json({ errorCode: "emailExists" });
        }

        // verify that the provided username does not exist in the database.
        const usernameExists = await User.findOne({
            where: {
                username: req.body.username.trim(),
            },
        });

        if (usernameExists) {
            return res.status(422).json({ errorCode: "usernameExists" });
        }

        // once all verification steps have been successfully completed, proceed to create the user in the database.
        const userData = await User.create({
            username: req.body.username.trim(),
            email: req.body.email.toLowerCase().trim(),
            password: req.body.password.trim(),
        });

        req.session.user_id = userData.id;
        req.session.logged_in = 1;

        req.session.save();

        res
            .status(200)
            .json({
                message: `Welcome aboard, ${userData.username}! Enjoy your journey with us!`,
            });
    } catch (error) {
        res.status(500).json(error);
    }
});

// set up a route for users to log in.
router.post("/login", async (req, res) => {
    try {
        // verify the existence of the user with the provided email in the database.
        const userData = await User.findOne({
            where: {
                email: req.body.email.toLowerCase().trim(),
            },
        });

        if (!userData) {
            return res
                .status(404)
                .json({ message: "Incorrect email or password, please try again" });

        }

        // verify that the hashed password stored in the database matches the password provided by the user.
        const validatePassword = bcrypt.compareSync(
            req.body.password,
            userData.password
        );

        if (!validatePassword) {
            return res
                .status(404)
                .json({ message: "Incorrect email or password, please try again" });
        }
        const userId = userData.id;
        console.log("!!!!!userData.id!!", userData.id);
        req.session.user_id = userId;
        req.session.logged_in = 1;

        req.session.save();

        return res
            .status(200)
            .json({ userId, message: "You have been successfully logged in!" });
    } catch (error) {
        res.status(500).json(error);
    }
});

// route for user to logout
router.post("/logout", async (req, res) => {
    try {
        if (req.session.logged_in) {
            req.session.destroy(() => {
                return res.status(200).end();
            });
        } else {
            return res.status(404).end();
        }
    } catch (error) {
        res.status(500).json(error);
    }
});
// END USER AUTHENTICATION ROUTES //

// Look up a username based on the active session
router.get("/session/lookup", async (req, res) => {
  try {
    const userSession = req.session.user_id;
    const userLoggedIn = req.session.logged_in;
    const userData = await User.findByPk(userSession, {
      attributes: { exclude: ["password"] },
    });

    // verify that there is an active session
    if (!userSession || !userLoggedIn) {
        return res.status(404).json({
            message: `There is no active session. Please log in.`,
        });
    }

    // verify that the user exists in the database.
    if (!userData) {
        return res.status(404).json({
            message: `The user with the provided id "${userSession}" does not exist. Please try again.`,
        });
    }

    const user = userData.get({ plain: true });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Try to find a user with the provided username in the database.  For verifying unique username. Returns true/false.
router.get("/checkusername/:username", async (req, res) => {
    try {
        const user = await User.findOne({
            where: { username: req.params.username },
        });

        if (user) {
            res.status(200).json(true);
        } else {
            res.status(200).json(false);
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

// Try to find a user with the provided email in the database.  For verifying unique email. Returns true/false.
router.get("/checkemail/:email", async (req, res) => {
    try {
        const user = await User.findOne({
            where: { email: req.params.email },
        });

        if (user) {
            res.status(200).json(true);
        } else {
            res.status(200).json(false);
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

// set up a route for users to update their own information.  Require the user to be logged in.
router.put("/editprofile/:username", async (req, res) => {
    try {
        const userSession = req.session.user_id;
        const userLoggedIn = req.session.logged_in;
        const userExists = await User.findOne({
            where: {
                username: req.params.username,
            },
            attributes: { exclude: ["password"] },
        });

        // verify that the user exists in the database.
        if (!userExists) {
            return res.status(400).json({
                message: `The user with the provided username "${req.params.username}" does not exist.`,
            });
        }

        // verify that the user is logged in and is the same user as the one being updated.
        if (userSession !== userExists.id || userLoggedIn !== 1) {
            return res.status(400).json({
                message: `You are not authorized to edit this user's profile.`,
            });
        }

        // proceed to update the user in the database.
        await User.update(
            {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                username: req.body.username,
                about_me: req.body.about_me,
                avatar_id: req.body.avatar_id,
            },
            {
                where: {
                    id: userExists.id,
                },
            }
        );
        res
            .status(200)
            .json({ message: `Your profile has been successfully updated!` });
    } catch (error) {
        res.status(500).json(error);
    }
});

// set up a route for users to update their own information.  Require the user to be logged in.
router.put("/editsecurity/:username", async (req, res) => {
    try {
        const userSession = req.session.user_id;
        const userLoggedIn = req.session.logged_in;
        const userExists = await User.findOne({
            where: {
                username: req.params.username,
            },
        });

        // verify that the user exists in the database.
        if (!userExists) {
            return res.status(400).json({
                message: `The user with the provided username "${req.params.username}" does not exist.`,
            });
        }

        // verify that the user is logged in and is the same user as the one being updated.
        if (userSession !== userExists.id || userLoggedIn !== 1) {
            return res.status(400).json({
                message: `You are not authorized to edit this user's security settings.`,
            });
        }

        // proceed to update the user in the database.
        await User.update(
            {
                password: req.body.first_name,
            },
            {
                where: {
                    id: userExists.id,
                },
            }
        );
        res.status(200).json({
            message: `Your security settings have been successfully updated!`,
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

// set up a route for users to delete their account.
router.delete("/delete/:username", async (req, res) => {
    try {
        const userSession = req.session.user_id;
        const userLoggedIn = req.session.logged_in;
        const userExists = await User.findOne({
            where: {
                username: req.params.username,
            },
        });

        // verify that the user exists in the database.
        if (!userExists) {
            return res.status(404).json({
                message: `The user with the provided id "${req.params.username}" does not exist.`,
            });
        }

        // verify that the user is logged in and is the same user as the one being deleted.
        if (userSession !== userExists.id || userLoggedIn !== 1) {
            return res.status(404).json({
                message: `You are not authorized to delete this user's account.`,
            });
        }

        // proceed to delete the user from the database.
        await User.destroy({
            where: {
                id: userExists.id,
            },
        });
        res
            .status(200)
            .json({ message: `Your account has been successfully deleted!` });
    } catch (error) {
        res.status(500).json(error);
    }
});

// set up a route for users to add a pinID to their saved_pins array.
router.put("/savepin", async (req, res) => {
  try {
    const userSession = req.session.user_id;
    const userLoggedIn = req.session.logged_in;

    // verify the user is logged in
    if (!userLoggedIn) {
      return res.status(400).json({
        message: `You must be logged in to save a pin.`,
      });
    }

    //   // verify that the user exists in the database using the provided username.
    const userExists = await User.findOne({
      where: {
        id: userSession,
      },
    });

    if (!userExists) {
      return res.status(400).json({
        message: `The user with the provided username "${userExists.username}" does not exist. Please try again.`,
      });
    }

    //   // verify that the user is logged in and is the same user as the one being updated.
    if (userSession !== userExists.id || userLoggedIn !== 1) {
      return res.status(400).json({
        message: `You are not authorized to edit this user's profile.`,
      });
    }
    console.log("req.body.pinId", req.body.pinId);
    // This is the format of each entry in the JSON array.
    // {
    //   "pinId": req.body.pinId,
    //   "completed": false
    // }
    // Break apart the saved_pins string into a JSON with pinId and completed keys.  Only do this if the string is not null.
    if (userExists.saved_pins !== null && userExists.saved_pins !== "") {
      var savedPinsJSON = JSON.parse(userExists.saved_pins);
      // If the pinID is already a value in the json, remove it.  Otherwise, add it.
      if (savedPinsJSON.some((e) => e.pinId === req.body.pinId)) {
        var savedPinsArray = savedPinsJSON.filter(
          (e) => e.pinId !== req.body.pinId
        );
      } else {
        var savedPinsArray = savedPinsJSON.concat({
          pinId: req.body.pinId,
          completed: false,
        });
      }
    } else {
      var savedPinsArray = [
        {
          pinId: req.body.pinId,
          completed: false,
        },
      ];
    }

    // Stringify the JSON array to be stored in the database.
    var savedPinsString = JSON.stringify(savedPinsArray);

    // proceed to update the user in the database.
    await User.update(
      {
        saved_pins: savedPinsString,
      },
      {
        where: {
          id: userExists.id,
        },
      }
    );
    res.status(200).json({
      message: `Your profile has been successfully updated! ${savedPinsString}`,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// set up router to find users by id
router.get("/:id", async (req, res) => {
    try {
        const userData = await User.findByPk(req.params.id, {
            attributes: { exclude: ["password"] },
        });

        if (!userData) {
            return res.status(404).json({
                message: `No user found with the provided id "${req.params.id}". Please try again.`,
            });
        }

        const user = userData.get({ plain: true });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;