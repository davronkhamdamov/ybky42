const { Sequelize, DataTypes, UUIDV4 } = require("sequelize");

const sequelize = new Sequelize(process.env.DB_URL);

sequelize
  .authenticate()
  .then(() => console.log("connected"))
  .catch((e) => console.log(e));

module.exports = { sequelize, DataTypes, UUIDV4 };
