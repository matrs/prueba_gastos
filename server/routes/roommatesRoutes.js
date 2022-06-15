"use strict";

const express = require("express");
const roommatesCtrl = require("../controllers/roommatesCtrl");

const router = express.Router();

// const usersFile = "./data/roommates.json";

router.post("/roommate", roommatesCtrl.roommatePost);

router.get("/roommates", roommatesCtrl.roommatesGet);

module.exports = router;
