const nodemailer = require("nodemailer");

const email = "test.jmaturana@gmail.com";

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass: "*****",
  },
});

const mailer = (user, gasto) => {
  let message = {
    from: email,
    to: email,
    subject: "Se ha hecho un gasto",
    html: `<h3><i>${user}</i> ha hecho un gasto de <code> ${gasto}</code> .</h3>`,
  };

  transporter.sendMail(message, (err, data) => {
    if (err) console.log(err);
    if (data) console.log("Mensaje enviado con éxito");
  });
};

module.exports = mailer;
