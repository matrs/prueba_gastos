const fs = require("fs");

function parseResult(number, n) {
  // n: number of decimal places
  return (number = Number.isInteger(number)
    ? number
    : parseFloat(number.toFixed(n)));
}

function readData(usersFile, gastosFile) {
  try {
    const { roommates } = JSON.parse(fs.readFileSync(usersFile, "utf8"));
    const { gastos } = JSON.parse(fs.readFileSync(gastosFile, "utf8"));
    return { roommates, gastos };
  } catch (err) {
    console.log("Error parsing the json file/s");
  }
}

module.exports = { readData, parseResult };
