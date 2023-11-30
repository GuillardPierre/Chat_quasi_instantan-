const express = require("express");
const router = express.Router();
const stuffCtrl = require("../controllers/stuff");

router.post("/", stuffCtrl.createMessage);
router.get("/", stuffCtrl.getAllMessages);
router.delete("/:user", stuffCtrl.deleteMessages);

module.exports = router;
