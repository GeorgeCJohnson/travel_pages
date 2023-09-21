const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class User extends Model {}

User.init(
    {
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
              isAlphanumeric: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [8, 128],
            },
        },
        saved_pins: {
            type: DataTypes.TEXT("long"),
            allowNull: true,
          },
        },
        {
          hooks: {
            beforeCreate: async (userData) => {
              userData.password = await bcrypt.hash(userData.password, 10);
              return userData.password;
            },
            beforeUpdate: async (userData) => {
              userData.password = await bcrypt.hash(userData.password, 10);
              return userData.password;
            },
          },
          sequelize,
          freezeTableName: true,
          modelName: "user",
          timestamps: false,
          underscored: true,
    }
)