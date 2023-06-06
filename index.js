const express = require("express");
const app = express();

const cors = require("cors");
require("dotenv/config");

const PORT = process.env.PORT || 3001;

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
    start: "05-06-2023 9:00:00",
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
    id: 3,
    room_id: 1,
    start: "05-06-2023 16:00:00",
    end: "05-06-2023 19:00:00",
  },
  {
    id: 4,
    room_id: 1,
    start: "06-06-2023 00:00:00",
    end: "06-06-2023 03:00:00",
  },
];

app.get("/api/rooms", (req, res) => {
  res.send({
    page: data.length,
    count: data.length,
    page_size: data.length,
    results: data,
  });
});

app.listen(PORT, () => {
  console.log("server is running on the url http://localhost:" + PORT);
});
