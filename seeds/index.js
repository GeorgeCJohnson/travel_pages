{
  "name": "travel_pages",
  "version": "1.0.0",
  "description": "Second group project",
  "main": "server.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node server.js",
    "watch": "node --watch server.js",
    "nodemon": "nodemon server.js",
    "seed": "node seeds/index.js"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "bcrypt": "^5.1.0",
    "connect-session-sequelize": "^7.1.6",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "express-handlebars": "^7.0.7",
    "express-session": "^1.17.3",
    "handlebars": "^4.7.7",
    "mysql2": "^3.3.1",
    "nodemon": "^2.0.22",
    "sequelize": "^6.31.1"
  }
}