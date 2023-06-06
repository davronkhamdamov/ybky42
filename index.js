const express = require("express");
const app = express();

const cors = require("cors");
require("dotenv/config");

app.use(express.json());
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

app.get("/api/rooms/:id", (req, res) => {
  const foundData = data.find((e) => +req.params.id === e.id);
  if (!foundData) {
    return res.send({
      error: "Topilmadi",
    });
  }
  res.send(foundData);
});

app.get("/api/rooms/:id/availability", (req, res) => {
  const result = time
    .map((e, i) => {
      if (e.room_id === +req.params.id && e.start.startsWith("05-06-2023")) {
        return e;
      }
    })
    .filter((e) => e);
  const d = new Array(result.length + 1)
    .fill("#")
    .map((e, i) => {
      if (i === 0) {
        return [
          {
            start: "00:00",
            end: result[i].start.split(" ")[1].split(":")[0] + ":00",
          },
        ];
      }
      if (i === result.length) {
        return [
          {
            start: result[i - 1].end.split(" ")[1].split(":")[0] + ":00",
            end: "00:00",
          },
        ];
      }
      if (
        result[i - 1].end.split(" ")[1].split(":")[0] + ":00" !==
        result[i].start.split(" ")[1].split(":")[0] + ":00"
      ) {
        return [
          {
            start: result[i - 1].end.split(" ")[1].split(":")[0] + ":00",
            end: result[i].start.split(" ")[1].split(":")[0] + ":00",
          },
        ];
      }
    })
    .filter((e) => e);
  res.send(d);
});
app.post("/api/rooms/:id/book", (req, res) => {
  if (+req.body.start.split(":")[0] >= +req.body.end.split(":")[0]) {
    return res.status(400).send({
      error: "Bad request",
    });
  }
  const result = time
    .map((e, i) => {
      if (e.room_id === +req.params.id && e.start.startsWith("05-06-2023"))
        return e;
    })
    .filter((e) => e);
  const check = result.some((e, i) => {
    if (
      +result[i].end.split(" ")[1].split(":")[0] <=
      +req.body.start.split(":")[0]
    ) {
      return (
        +result[i + 1]?.start.split(" ")[1].split(":")[0] >=
        +req.body.end.split(":")[0]
      );
    }
  });
  if (check) {
    res.send({
      message: "Xona band qilindi",
    });
  } else {
    res.send({
      error: "Hona band",
    });
  }
});
app.listen(PORT, () => {
  console.log("server is running on the url http://localhost:" + PORT);
});
