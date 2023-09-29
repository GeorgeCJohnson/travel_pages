const sequelize = require('../config/connection');
const { User, Pin, Avatar } = require('../models');

// Import seed data
const userSeedData = require('./userSeedData.json');
const pinSeedData = require('./pinSeedData.json');
const avatarSeedData = require('./avatarSeedData.json');

// Define the seed function
const seedDb = async () => {
	try {
		// Sync the database
		await sequelize.sync({ force: true });
		console.log('\n----- database synced -----\n');

		// Seed Users first
		const users = await User.bulkCreate(userSeedData, {
			individualHooks: true,
			returning: true,
		});
		console.log('\n----- Users seeded -----\n');

		// Seed Avatars using the created Users
		avatarSeedData.forEach(async (avatarData, index) => {
			await Avatar.bulkCreate(
				{
					...avatarData,
					user_id: users[Math.floor(Math.random() * users.length)].id,
				},
				{
					individualHooks: true,
					returning: true,
				}
			);
		});

		// await Avatar.bulkCreate(
		//   avatarSeedData.map((avatarData, index) => ({
		//     ...avatarData,
		//     user_id: users[index].id, // Use the created user's id
		//   })),
		//   {
		//     individualHooks: true,
		//     returning: true,
		//   }
		// );
		// console.log('\n----- Avatars seeded -----\n');

		// Seed Pins after Users and Avatars
		// for (const pinData of pinSeedData) {
		// 	await Pin.create({
		// 		...pinData,
		// 		user_id: users[Math.floor(Math.random() * users.length)].id,
		// 	});
		// }
		// console.log('\n----- Pins seeded -----\n');

		process.exit(0);
	} catch (error) {
		console.error('Error seeding the database:', error);
		process.exit(1);
	}
};

// Call the seed function
seedDb();