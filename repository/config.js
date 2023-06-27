const { Sequelize, DataTypes, UUIDV4 } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "postgres",
  host: "localhost",
  username: "postgres",
  password: "new_password",
  database: "ybky",
  port: 5432,
  logging: false
});

sequelize
  .authenticate()
  .then(() => console.log("connected"))
  .catch((e) => console.log(e));

module.exports = { sequelize, DataTypes, UUIDV4 };
