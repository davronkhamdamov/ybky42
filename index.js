const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors())
require("dotenv/config");
const { room, book } = require("./repository/module");
const { filteredTime } = require("./repository/repo");
const { Op } = require("sequelize");

app.use(express.json());
const PORT = process.env.PORT || 3001;

app.get("/api/rooms", async (req, res) => {

  const pageAsNumber = Number.parseInt(req.query.page)
  const sizeAsNumber = Number.parseInt(req.query.page_size)
  const { search, type } = req.query
  let page = 0
  if (!Number.isNaN(pageAsNumber) && pageAsNumber > 1) {
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
    return res.status(404).send({
      error: "topilmadi",
    });
  res.send(data);
});

app.get("/api/rooms/:id/availability", async (req, res) => {
  const data = await room.findOne({ where: { id: req.params.id } });
  if (!data) {
    return res.status(404).send({
      message: "room not found"
    })
  }
  const date = new Date();
  const datePicker = String(req.query.date ||
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
  const regExp = /^(0[1-9]|[1-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-[0-9]{4} (2[0-3]|[01][0-9]):[0-5][0-9]:[0][0]$/g;
  const startMatch = regExp.exec(req.body.start);

  if (!startMatch) {
    return res.status(400).send({
      error: "Bad request",
      hint: "Date format DD-MM-YYYY HH:MM:SS at start"
    });
  }
  regExp.exec(req.body.end); // For some reason it didn't work, so I forced it
  if (!regExp.exec(req.body.end)) {
    return res.status(400).send({
      error: "Bad request",
      hint: "Date format DD-MM-YYYY HH:MM:SS at end"
    });
  }


  if (+req.body.start.split(" ")[1].split(":").join("") >= +req.body.end.split(" ")[1].split(":").join("")) {
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
  const data = await room.findOne({ where: { id: req.params.id } })
  if (!data) {
    return res.status(404).send({
      message: "topilmadi"
    })
  }
  const findBook = await book.findAll({ where: { id: data.id } })
  if (data.capacity < findBook.length) {
    return res.send({ error: "Hona to'ldi" });
  }
  if (check) {
    try {
      await book.create({
        room_id: req.params.id,
        start: req.body.start,
        end: req.body.end,
      });
      res.status(201).send({ message: "xona muvaffaqiyatli band qilindi" });
    } catch (er) {
      res.send({
        error: true,
        message: er,
      });
    }
  } else {
    res.status(410).send({ error: "uzr, siz tanlagan vaqtda xona band" });
  }
});
app.listen(PORT, () => {
  console.log("server is running on the url http://localhost:" + PORT);
});
