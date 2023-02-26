var express = require("express");
var router = express.Router();
// var scrapper = require("../utils/scrapper");
var dbHelper = require("../utils/db");
var bot = require("../bot/index");

router.get("/", async (req, res) => {
  const workers = await (await dbHelper.getWorkers()).toArray();
  const tabor = await (await dbHelper.getWorkerVeh()).toArray();
  console.log("tr", tabor);
  res.status(200).json(workers);
});

router.get("/worker-veh", async (req, res) => {
  // await dbHelper.getWorkerVeh("63f7cb6d52edb09fcf28e681")
  const vehicle = await (await dbHelper.getWorkerVeh()).toArray();
  res.status(200).json(vehicle);
});

router.get("/tabor", async (req, res) => {
  // await dbHelper.getWorkerVeh("63f7cb6d52edb09fcf28e681")
  const vehicle = await (await dbHelper.getTabor()).toArray();
  res.status(200).json(vehicle);
});

router.get("/users-avatars", async (req, res) => {
  // await dbHelper.getWorkerVeh("63f7cb6d52edb09fcf28e681")
  // console.log(req.params);
  const avatarUrls = await bot.getUserAvatars();
  // console.log(avatarUrls);
  // const vehicle = await (await dbHelper.getWorkerVeh()).toArray();
  res.status(200).json(avatarUrls);
});

module.exports = router;
