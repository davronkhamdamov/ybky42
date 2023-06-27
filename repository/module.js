const { DataTypes, sequelize } = require("./config");

const room = sequelize.define("room", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    isIn: [["focus", "team", "conference"]],
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
const book = sequelize.define("book", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  room_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  start: {
    type: DataTypes.STRING,
    allowNull: false
  },
  end: {
    type: DataTypes.STRING,
    allowNull: false
  },
});

room.hasMany(book, {
  foreignKey: "room_id",
});

module.exports = { room, book };
