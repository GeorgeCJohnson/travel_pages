// Import necessary modules
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

// Define the 'Pin' model class
class Pin extends Model {}

// Initialize the 'Pin' model with field definitions and options
Pin.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    pinTitle: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true, // Ensures the title is not empty
        len: [2, 255], // Allows titles between 2 and 255 characters long
      },
    },
    pinDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true, // Ensures the description is not empty
      },
    },
    pinLocation: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^[\w\s]+$/, // Allow word characters (alphanumeric) and spaces
        notEmpty: true, // Ensures the field is not empty
      },
    },
    pinGeocords: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/, // Example: Validates latitude and longitude in decimal format
      },
    },
    pinLink: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isURL: true, // Validates that the link is a valid URL
      },
    },
    pinCategory: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pinTag: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pinImage: {
      type: DataTypes.BLOB("long"),
      allowNull: true,
    },
    pinCompletion: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: "user", // Reference the 'user' model
        key: "id", // Use the 'id' field as the foreign key
      },
    },
  },
  {
    sequelize, // Set the Sequelize connection
    timestamps: false, // Disable timestamps (e.g., createdAt, updatedAt)
    underscored: true, // Use underscores in field names (e.g., pin_title instead of pinTitle)
    freezeTableName: true, // Prevent Sequelize from pluralizing the table name
    tableName: "pin", // Define the model name
  }
);

module.exports = Pin; // Export the 'Pin' model
