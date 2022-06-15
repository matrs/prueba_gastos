"use strict";

const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs").promises;

const generarRoommate = async () => {
  const { data } = await axios.get("https://randomuser.me/api");
  const roommate = data.results[0];
  const user = {
    id: uuidv4().slice(30),
    nombre: `${roommate.name.title} ${roommate.name.first} ${roommate.name.last}`,
    debe: 0,
    recibe: 0,
  };
  return user;
};

const guardarRoommate = async (roommate, usersFile) => {
  const roommatesJSON = await fs.readFile(usersFile, "utf8");
  const { roommates } = JSON.parse(roommatesJSON);
  //   console.log(roommates)
  roommates.push(roommate);
  await fs.writeFile(usersFile, JSON.stringify({ roommates }, null, 2));
};

module.exports = { generarRoommate, guardarRoommate };
