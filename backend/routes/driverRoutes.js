import express from "express";
import Driver from "../models/Driver.js";
const router = express.Router();

router.get("/", async (req, res) => {
  const drivers = await Driver.find();
  res.json(drivers);
});

router.post("/", async (req, res) => {
  const { name, phone, license_number } = req.body;
  const driver = new Driver({ name, phone, license_number });
  await driver.save();
  res.status(201).json(driver);
});

export default router;
