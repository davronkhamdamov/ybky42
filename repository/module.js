const { DataTypes, sequelize, UUIDV4 } = require("./config");

const date = new Date();
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
    is: /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0][0]:[0][0]/gm,
  },
  end: {
    type: DataTypes.STRING,
    is: /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0][0]:[0][0]/gm,
  },
});

room.hasMany(book, {
  foreignKey: "room_id",
});

module.exports = { room, book };
