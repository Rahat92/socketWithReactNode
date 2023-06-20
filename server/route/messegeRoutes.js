const express = require("express");
const { createMessage } = require("../controller/messegeControllers");

const router = express.Router();

router.route("/").post(createMessage);

module.exports = router;
