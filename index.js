const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors)
require("dotenv/config");
const { room, book } = require("./repository/module");
const { filteredTime } = require("./repository/repo");

app.use(express.json());
const PORT = process.env.PORT || 3001;

app.get("/api/rooms", async (req, res) => {
  const data = await room.findAll();
  res.send({
    page: data.length,
    count: data.length,
    page_size: data.length,
    results: data,
  });
});

app.get("/api/rooms/:id", async (req, res) => {
  const data = await room.findOne({ where: { id: req.params.id } });
  if (!data)
    return res.send({
      error: "Topilmadi",
    });
  res.send(data);
});

app.get("/api/rooms/:id/availability", async (req, res) => {
  const date = new Date();
  res.send(
    await filteredTime(
      req.params.id,
      // req.body.date ||
      `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`
    )
  );
});
app.post("/api/rooms/:id/book", async (req, res) => {
  if (+req.body.start.split(" ")[1].split(":")[0] >= +req.body.end.split(" ")[1].split(":")[0]) {
    return res.status(400).send({
      error: "Bad request",
    });
  }
  const result = await filteredTime(
    req.params.id,
    req.body.start.split(" ")[0]
  );
  const check = result.some((e, i) => {
    console.log(req.body, e);
    if (
      + e.end.split(":")[0] <
      +req.body.start.split(" ")[1].split(":")[0] &&
      (i !== result.length - 1)
    ) {
      return (
        +result[i + 1].start.split(":")[0] >=
        +req.body.end.split(" ")[1].split(":")[0]
      );
    }
  });
  if (check) {
    try {
      await book.create({
        room_id: req.params.id,
        start: req.body.start,
        end: req.body.end,
      });
      res.send({ message: "Xona band qilindi" });
    } catch (er) {
      res.send({
        error: true,
        message: er,
      });
    }
  } else {
    res.send({ error: "Hona band" });
  }
});
app.listen(PORT, () => {
  console.log("server is running on the url http://localhost:" + PORT);
});
