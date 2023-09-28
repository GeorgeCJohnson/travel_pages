// Import necessary modules
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

// Define the 'Avatar' model class
class Avatar extends Model {} // Use singular 'Avatar' for the model name

Avatar.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    avatarName: {
      // Change to 'avatarName' (singular) for consistency
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensures unique avatar names
    },
    avatarImage: {
      // Change to 'avatarImage' (singular) for consistency
      type: DataTypes.STRING,
      allowNull: false, // Requires an avatar image path
    },
    // Add the user_id field as a foreign key
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: "user",
        key: "id",
      },
    },
  },
  {
    sequelize, // Set the Sequelize connection
    timestamps: false, // Disable timestamps (e.g., createdAt, updatedAt)
    underscored: true, // Use underscores in field names (e.g., avatar_name instead of avatarName)
    freezeTableName: true, // Prevent Sequelize from pluralizing the table name
    tableName: "avatar", // Define the model name
  }
);

module.exports = Avatar; // Export the corrected model name 'Avatar'
