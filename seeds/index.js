const sequelize = require("../config/connection");
const { User, Pins, Avatars } = require("../models");

const userSeedData = require("./userSeedData.json");
const pinSeedData = require("./pinSeedData.json");
const avatarSeedData = require("./avatarSeedData.json");

const seedDb = async () => {
  await sequelize.sync({ force: true });
  console.log("\n----- database synced -----\n");

  const users = await User.bulkCreate(userSeedData, {
    individualHooks: true,
    returning: true,
  });
  console.log("'\n ----- Users seeded -----\n");

  for (const pinData of pinSeedData) {
    await Pins.create({
      ...pinData,
      user_id: users[Math.floor(Math.random() * users.length)].id,
    });
  }
  console.log("'\n ----- Pins seeded -----\n");

  await Avatars.bulkCreate(avatarSeedData, {
    individualHooks: true,
    returning: true,
  });

  console.log("'\n ----- Avatars seeded -----\n");

  process.exit(0);
};

seedDb();