const express = require("express");
const app = express();

const cors = require("cors");
require("dotenv/config");
const { data, filteredTime } = require("./repository/repo");

app.use(express.json());
const PORT = process.env.PORT || 3001;

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
  res.send(filteredTime(req.params.id, "05-06-2023"));
});
app.post("/api/rooms/:id/book", (req, res) => {
  if (+req.body.start.split(":")[0] >= +req.body.end.split(":")[0]) {
    return res.status(400).send({
      error: "Bad request",
    });
  }
  const result = filteredTime(req.params.id, "05-06-2023");
  const check = result.some((e, i) => {
    if (
      +result[i].end.split(":")[0] <= +req.body.start.split(":")[0] &&
      i !== result.length - 1
    ) {
      return +result[i + 1].start.split(":")[0] >= +req.body.end.split(":")[0];
    }
  });

  res.send(check ? { error: "Hona band" } : { message: "Xona band qilindi" });
});
app.listen(PORT, () => {
  console.log("server is running on the url http://localhost:" + PORT);
});
