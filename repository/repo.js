const data = [
  {
    id: 1,
    name: "mytaxi",
    type: "focus",
    capacity: 1,
  },
  {
    id: 2,
    name: "workly",
    type: "team",
    capacity: 5,
  },
  {
    id: 3,
    name: "express24",
    type: "conference",
    capacity: 15,
  },
];

const time = [
  {
    id: 1,
    room_id: 1,
    start: "05-06-2023 00:00:00",
    end: "05-06-2023 11:00:00",
  },
  {
    id: 2,
    room_id: 1,
    start: "05-06-2023 12:00:00",
    end: "05-06-2023 14:00:00",
  },
  {
    id: 3,
    room_id: 1,
    start: "05-06-2023 16:00:00",
    end: "05-06-2023 19:00:00",
  },
  {
    id: 4,
    room_id: 2,
    start: "05-06-2023 00:00:00",
    end: "05-06-2023 01:00:00",
  },
  {
    id: 4,
    room_id: 2,
    start: "05-06-2023 01:00:00",
    end: "05-06-2023 02:00:00",
  },
  {
    id: 5,
    room_id: 2,
    start: "05-06-2023 03:00:00",
    end: "05-06-2023 04:00:00",
  },
  {
    id: 8,
    room_id: 2,
    start: "05-06-2023 20:00:00",
    end: "05-06-2023 21:00:00",
  },
  {
    id: 7,
    room_id: 2,
    start: "05-06-2023 22:00:00",
    end: "05-06-2023 23:00:00",
  },
];
const filteredTime = (id, date) => {
  const available = time
    .map((e) => e.room_id === +id && e.start.startsWith(date) && e)
    .filter((e) => e);
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
module.exports = { data, filteredTime };
