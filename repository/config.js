const { Sequelize, DataTypes, UUID } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASEURL, { logging: false });

sequelize
  .authenticate()
  .then(() => console.log("connected"))
  .catch((e) => console.log(e));

module.exports = { sequelize, DataTypes, UUID };
