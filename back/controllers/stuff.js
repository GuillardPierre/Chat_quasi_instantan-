const messages = require("../models/messages");

exports.createMessage = (req, res, next) => {
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
};

exports.getAllMessages = (req, res, next) => {
  messages
    .find()
    .then((things) => res.status(200).json(things))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteMessages = (req, res, next) => {
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
};
