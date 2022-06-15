"use strict";

const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { parseResult, readData } = require("../modules/utilities");
const mailer = require("../modules/mailer");

const usersFile = "/home/mibu/Documents/roommates/roommates.json";
const gastosFile = "/home/mibu/Documents/roommates/gastos.json";
// const usersFile = "./data/roommates.json";
// const gastosFile = "./data/gastos.json";

const getGastos = (req, res) => {
  const gastos = JSON.parse(fs.readFileSync(gastosFile, "utf8"));
  res.send(gastos);
};

const postGasto = (req, res) => {
  // readData handles its own error/s
  const { roommates, gastos } = readData(usersFile, gastosFile);
  try {
    const { roommate, descripcion, monto } = req.body;
    //   Length: Save the number of users when the gasto was made, which is
    // important for editing the gasto. if a user with multiple gastos exists,
    //   each of those gastos could've been done when different number of users existed
    const gasto = {
      id: uuidv4().slice(30),
      roommate,
      descripcion,
      monto,
      length: roommates.length,
    };

    // Update gastos.json //
    gastos.push(gasto);
    fs.writeFileSync(gastosFile, JSON.stringify({ gastos }, null, 2));

    // Update roommates.json //
    const CostPerUser = monto / roommates.length;
    roommates.map((user) => {
      if (user.nombre === roommate) {
        user.debe += parseResult(CostPerUser, 2);
        user.recibe += parseResult(monto - CostPerUser, 2);
      }
    });
    fs.writeFileSync(usersFile, JSON.stringify({ roommates }, null, 2));

    // Send an email (It works) //
    // mailer(roommate, monto);

    res.json(req.body);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
};

const putGasto = (req, res) => {
  const { roommates, gastos } = readData(usersFile, gastosFile);
  try {
    const { id } = req.query;
    const { roommate, descripcion, monto } = req.body;
    let newGasto = 0;
    let oldGasto = 0;
    let oldMonto = 0;

    // Update gastos.json //
    // with filter it iterates twice, but prob. not important except for very big arrays
    gastos
      .filter((gasto) => gasto.id === id)
      .forEach((gasto) => {
        oldMonto = gasto.monto;
        oldGasto = gasto.monto / gasto.length;
        newGasto = monto / gasto.length;
        gasto.monto = monto;
      });
    fs.writeFileSync(gastosFile, JSON.stringify({ gastos }, null, 2));
    // Update roommates.json //
    roommates
      .filter((user) => user.nombre === roommate)
      .map((user) => {
        user.debe += parseResult(newGasto - oldGasto, 2);
        user.recibe += parseResult(monto - newGasto - (oldMonto - oldGasto), 2);
      });
    fs.writeFileSync(usersFile, JSON.stringify({ roommates }, null, 2));

    res.send("Gastos editados correctamente");
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
};

const deleteGasto = (req, res) => {
  try {
    const { roommates, gastos } = readData(usersFile, gastosFile);
    const { id } = req.query;
    console.log("id and req.body", id, req.body);
    let roommate = "";
    let oldGasto = 0;
    let oldMonto = 0;

    // Update gastos.json //
    gastos
      .filter((gasto) => gasto.id === id)
      .forEach((gasto) => {
        oldMonto = gasto.monto;
        oldGasto = gasto.monto / gasto.length;
        roommate = gasto.roommate;
      });

    let newGastos = gastos.filter((gasto) => gasto.id !== id);
    fs.writeFileSync(
      gastosFile,
      JSON.stringify({ gastos: newGastos }, null, 2)
    );
    // Update roommates.json ///* rithm */
    roommates
      .filter((user) => user.nombre === roommate)
      .map((user) => {
        user.debe -= parseResult(oldGasto, 2);
        user.recibe -= parseResult(oldMonto - oldGasto, 2);
      });
    fs.writeFileSync(usersFile, JSON.stringify({ roommates }, null, 2));
    res.send("Gastos editados correctamente");
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
};

module.exports = { postGasto, putGasto, deleteGasto, getGastos };
