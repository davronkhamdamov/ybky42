const express = require("express");
const app = express();

const cors = require("cors");
require("dotenv/config");

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("server is running on the url http://localhost:" + PORT);
});
