const express = require("express");
const app = express();
const { URL } = require('url');

const cors = require("cors");
app.use(cors())
require("dotenv/config");
const { room, book } = require("./repository/module");
const { filteredTime } = require("./repository/repo");
const { Op } = require("sequelize");

app.use(express.json());
const PORT = process.env.PORT || 3001;

app.get("/api/rooms", async (req, res) => {

  const pageAsNumber = Number.parseInt(req.query.size)
  const sizeAsNumber = Number.parseInt(req.query.page)
  const { search, type } = req.query
  let page = 0
  if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
    page = pageAsNumber
  }
  let page_size = 10
  if (!Number.isNaN(sizeAsNumber) && pageAsNumber > 0 && pageAsNumber < 10) {
    page_size = sizeAsNumber
  }
  const data = await room.findAndCountAll(
    {
      where: (search || type) && {
        [Op.or]: [{
          type: type ? type : null,
        }, {
          name: {
            [Op.like]: search + "%"
          }
        }]
      },
      limit: page_size,
      offset: page * page_size
    })
  res.send({
    page,
    count: data.count,
    page_size,
    results: data.rows,
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
  const datePicker = String(req.body.date ||
    `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`).trim()
  res.send(
    await filteredTime(
      req.params.id,
      datePicker
    ).then(data => data.map(e => {
      return {
        start: datePicker + " " + e.start,
        end: datePicker + " " + e.end
      }
    }))
  );
});
app.post("/api/rooms/:id/book", async (req, res) => {
  const regExp = /^(0[1-9]|[1-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-[0-9]{4} (2[0-4]|[01][0-9]):[0][0]$/g
  if (!regExp.exec(req.body.start)) {
    return res.status(400).send({
      error: "Bad request",
      hint: "Date format DD-MM-YYYY HH:00"
    });
  }

  if (+req.body.start.split(" ")[1].split(":")[0] >= +req.body.end.split(" ")[1].split(":")[0] || req.body.start.split(' ')[0] !== req.body.end.split(' ')[0]) {
    return res.status(400).send({
      error: "Bad request",
    });
  }

  const result = await filteredTime(
    req.params.id,
    req.body.start.split(" ")[0]
  );
  const check = result.some((e) => {
    if (
      +e.end.split(":")[0] >=
      +req.body.end.split(" ")[1].split(":")[0]
      &&
      +e.start.split(":")[0] <=
      +req.body.start.split(" ")[1].split(":")[0]
    ) {
      return true
    } else {
      return false
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
