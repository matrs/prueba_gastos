"use strict";

const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const gastosCtrl = require("../controllers/gastosCtrl");

const { parseResult, readData } = require("../modules/utilities");

const router = express.Router();

router.use(express.json({ type: "text/plain" }));

// const usersFile = "./data/roommates.json";

router.route("/gastos").get(gastosCtrl.getGastos);

router
  .route("/gasto")
  .post(gastosCtrl.postGasto)
  .put(gastosCtrl.putGasto)
  .delete(gastosCtrl.deleteGasto);

module.exports = router;
