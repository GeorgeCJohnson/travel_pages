// Import necessary modules
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const bcrypt = require("bcrypt");

// Define the 'User' model class
class User extends Model {}

User.init(
  {
    // Define the User model fields
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isAlphanumeric: true, // Validates that username contains only letters and numbers
      },
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true, // Allow the field to be empty (null)
      validate: {
        isAlpha: true, // Validates that first_name contains only alphabetic characters
      },
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isAlpha: true, // Validates that last_name contains only alphabetic characters
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, // Validates that email is in a valid email format
        isLowercase: true, // Converts email to lowercase before validation
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8, 128], // Validates that password length is between 8 and 128 characters
      },
    },
    about_me: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    saved_pins: {
      type: DataTypes.TEXT("long"), // Define the field as a long text type
      allowNull: true,
      validate: {
        len: [0, 10000], // Set a maximum length of 10,000 characters (customize as needed)
      },
    },
  },
  {
    hooks: {
      // Hash the password before creating a new user
      beforeCreate: async (userData) => {
        console.log("Before hashing - userData.password:", userData.password);

        if (userData.password) {
          // Check if password is defined
          userData.password = await bcrypt.hash(userData.password, 10);
        }

        console.log("After hashing - userData.password:", userData.password);

        return userData; // Return the user data object, not just the password
      },
      // Hash the password before updating if it has changed
      beforeUpdate: async (userData) => {
        if (userData.changed("password")) {
          userData.password = await bcrypt.hash(userData.password, 10);
        }
        return userData;
      },
    },
    sequelize, // Set the Sequelize connection
    timestamps: false, // Disable timestamps (e.g., createdAt, updatedAt)
    underscored: true, // Use underscores in field names (e.g., first_name instead of firstName)
    freezeTableName: true, // Prevent Sequelize from pluralizing the table name
    modelName: "user", // Define the model name
  }
);

module.exports = User; // Export the User model


// Originally had avatar_id in the User model
	// avatar_id = foreign key reference to the ID in Avatar model
	// This means that each user has a specific avatar identified by its ID

// This created a chicken or egg problem (circular dependency issue)
// User model reference Avatar model and vice versa
// Caused problems during npm run seed

// Solution was to make 1 of the models to be the parent and the other, the child
// Made more sense for Avatar model to have the ID of the User model
// This means the Avatar model is the child of the User model

// Removing the avatar_id from User model solves the issue.