const { DataTypes, sequelize, UUIDV4 } = require("./config");

const room = sequelize.define("room", {
  id: {
    type: DataTypes.STRING,
    defaultValue: UUIDV4,
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
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  room_id: {
    type: DataTypes.STRING,
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
