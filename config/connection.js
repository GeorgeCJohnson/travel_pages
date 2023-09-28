// Import necessary modules
const Sequelize = require("sequelize");
require("dotenv").config(); // Load environment variables from a .env file

let sequelize; // Declare a variable to hold the Sequelize instance

// Check if a JAWSDB_URL environment variable exists (usually provided by a hosting service like Heroku)
if (process.env.JAWSDB_URL) {
  // If JAWSDB_URL exists, create a Sequelize instance using the provided URL
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
  // If JAWSDB_URL doesn't exist, create a Sequelize instance with local database configuration
  sequelize = new Sequelize(
    process.env.DB_NAME,     // Your database name
    process.env.DB_USER,     // Your database username
    process.env.DB_PASSWORD, // Your database password
    {
      host: "localhost",     // Database host (usually localhost for local development)
      dialect: "mysql",      // Database dialect (e.g., MySQL, PostgreSQL)
      port: 3306,            // Database port
    }
  );
}

module.exports = sequelize; // Export the Sequelize instance for use in other parts of your application
