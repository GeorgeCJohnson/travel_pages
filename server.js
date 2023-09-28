// Import required modules and packages
const path = require("path");  // Provides utilities for working with file and directory paths
const express = require("express");  // Express.js web application framework
const session = require("express-session");  // Middleware for managing sessions
const exphbs = require("express-handlebars");  // Template engine for rendering HTML
const routes = require("./controllers");  // Importing your application's routes
const helpers = require("./utils/helpers");  // Custom helper functions

// Import Sequelize and create a connection to the database
const sequelize = require("./config/connection");  // Sequelize ORM for working with databases
const SequelizeStore = require("connect-session-sequelize")(session.Store);  // Session store for Sequelize

// Create an instance of the Express application
const app = express();
const PORT = process.env.PORT || 3001;  // Define the port number for the server

// Configure session settings
const sess = {
  secret: "Super secret secret",  // A secret key to encrypt session data (change this to a strong, unique value)
  cookie: {
    maxAge: 300000,  // Session duration in milliseconds (5 minutes)
    httpOnly: true,  // Prevents client-side JavaScript from accessing the session cookie
    secure: true,  // Ensures that the cookie is only sent over HTTPS
    sameSite: "strict",  // Protects against Cross-Site Request Forgery (CSRF) attacks
  },
  resave: false,  // Do not resave unchanged sessions
  saveUninitialized: true,  // Save new sessions that haven't been modified
  store: new SequelizeStore({
    db: sequelize,  // Store session data in the Sequelize database
  }),
};

// Use the session middleware with the configured settings
app.use(session(sess));

// Configure the Handlebars.js template engine with custom helpers
const hbs = exphbs.create({ helpers });

// Set the view engine to Handlebars
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (e.g., stylesheets, images) from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Use the routes defined in the 'controllers' module
app.use(routes);

// Sync the Sequelize models with the database and start the server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("Now listening on port " + PORT));
});
