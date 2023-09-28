// Import Sequelize models
const Avatar = require("./Avatar");
const Pin = require("./Pin");
const User = require("./User");

// Define associations between models

// A User can have many Pins, and 'user_id' is the foreign key linking them
User.hasMany(Pin, {
  foreignKey: "user_id",
  onDelete: "CASCADE", // Cascade delete Pins when a User is deleted
});

// A User belongs to one Avatar, and 'user_id' is the foreign key linking them
User.belongsTo(Avatar, {
  foreignKey: "user_id",
  onDelete: "CASCADE", // Cascade delete Avatar when a User is deleted
});

// A Pin belongs to one User, and 'user_id' is the foreign key linking them
Pin.belongsTo(User, {
  foreignKey: "user_id",
});

// An Avatar can have many Users, and 'user_id' is the foreign key linking them
Avatar.hasMany(User, {
  foreignKey: "user_id",
});

// Export models
module.exports = {
  User,
  Avatar,
  Pin,
};
