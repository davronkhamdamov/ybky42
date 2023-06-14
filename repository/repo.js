const { book, room } = require("./module");
room.sync({ force: false }).then((r) => r);
book.sync({ force: false }).then((r) => r);
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const filteredTime = async (id, date) => {
  const available = await room
    .findAll({
      include: [{
        model: book,
        where: {
          start: {
            [Op.like]: `${date}%`
          }
        }
      }],
      where: { id },
    })
    .then((data) => data[0] ? data[0].books : {});
  if (!available[0]) {
    return [
      {
        start: "00:00",
        end: "24:00",
      },
    ];
  }
  return new Array(available.length + 1)
    .fill("#")
    .map((e, i) => {
      if (i === 0 && +available[0].start.split(" ")[1].split(":")[0] !== 0) {
        return {
          start: "00:00",
          end: available[i].start.split(" ")[1].split(":")[0] + ":00",
        };
      }
      if (
        i === available.length &&
        +available[available.length - 1].end.split(" ")[1].split(":")[0] !== 24
      ) {
        return {
          start: available[i - 1].end.split(" ")[1].split(":")[0] + ":00",
          end: "24:00",
        };
      } else if (
        i === available.length &&
        +available[available.length - 1].end.split(" ")[1].split(":")[0] === 24
      ) {
      } else if (
        i !== 0 &&
        i !== available.length &&
        available[i - 1].end.split(" ")[1].split(":")[0] !==
        available[i].start.split(" ")[1].split(":")[0]
      ) {
        return {
          start: available[i - 1].end.split(" ")[1].split(":")[0] + ":00",
          end: available[i].start.split(" ")[1].split(":")[0] + ":00",
        };
      }
    })
    .filter((e) => e);
};
module.exports = { filteredTime };
