// Export models
const Avatars = require("./Avatars");
const Pins = require("./Pins");
const User = require('./User');

Pins.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

module.exports = {
    User,
    Avatars,
    Pins,
};