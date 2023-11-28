const express = require("express");
const mongoose = require("mongoose");
const messages = require("./models/messages");
const bodyParser = require("body-parser");
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(cors());
mongoose
  .connect(`${process.env.MONGODB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) => console.log(error, "Connexion à MongoDB échouée !"));
app.use(bodyParser.json());

//Pour poster messages
app.post("/api/messages", (req, res, next) => {
  const message = new messages({
    ...req.body,
  });
  console.log(req.body);
  message
    .save()
    .then(() => res.status(201).json({ message: "Message enregistré !" }))
    .catch((error) => {
      res.status(400).json({ error });
      console.log(error);
    });
});

//Pour récupérer tous les messages
app.get("/api/messages", (req, res, next) => {
  messages
    .find()
    .then((things) => res.status(200).json(things))
    .catch((error) => res.status(400).json({ error }));
});

//Pour supprimer les messagees d'un user
app.delete("/api/messages/:user", (req, res, next) => {
  const userToDelete = decodeURIComponent(req.params.user);
  messages
    .deleteMany({ user: userToDelete })
    .then(() =>
      res
        .status(200)
        .json({ message: `Suppression des messages de ${userToDelete}` })
    )
    .catch((error) => {
      res.status(400).json(error);
      console.log(error);
    });
});

// app.get('/buglol', (req, res, next) => {
//     const messagePierre = messages.findOne({user: "Pierro"}).exec()
//     .catch(error => res.status(400).json({error}))
//     console.log(await messagePierre)
// })

module.exports = app;
