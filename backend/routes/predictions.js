import express from "express";
import { getPrediction } from "../lib/mlService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  console.log("✅ /api/predictions HIT");
  console.log("📦 BODY:", req.body);

  try {
    const { expenses, savings } = req.body;

    if (!Array.isArray(expenses) || !Array.isArray(savings)) {
      console.error("❌ Invalid arrays");
      return res.status(400).json({ error: "Invalid input" });
    }

    console.log("📊 expenses:", expenses);
    console.log("📊 savings:", savings);

    const prediction = await getPrediction(expenses, savings);

    console.log("✅ prediction:", prediction);
    res.json(prediction);
  } catch (err) {
    console.error("🔥 ROUTE CRASH:", err);
    res.status(500).json({ error: "Prediction failed" });
  }
});


export default router;
