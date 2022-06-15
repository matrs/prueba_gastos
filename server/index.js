"use strict";

const express = require("express");
const path = require("path");
const rommatesRoutes = require("./routes/roommatesRoutes");
const gastosRoutes = require("./routes/gastosRoutes");

const app = express();

// middleware
app.use(express.static("../"));
app.use(gastosRoutes);
app.use(rommatesRoutes);

// Basic server setup
const port = 8001;
app.listen(port, console.log(`Servidor escuchando en puerto ${port}`));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
