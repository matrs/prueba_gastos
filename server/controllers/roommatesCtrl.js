"use strict";

const fs = require("fs");
const { generarRoommate, guardarRoommate } = require("../modules/roommates");

const usersFile = "../roommates.json";

const roommatePost = async (req, res) => {
  try {
    const roommate = await generarRoommate();
    await guardarRoommate(roommate, usersFile);
    res.send(roommate);
  } catch (err) {
    res.status(500).send(err);
  }
};

const roommatesGet = (req, res) => {
  const roommates = JSON.parse(fs.readFileSync(usersFile, "utf8"));
  res.json(roommates);
};

module.exports = { roommatePost, roommatesGet };
