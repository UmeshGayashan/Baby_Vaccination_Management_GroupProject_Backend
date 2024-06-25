const express = require("express");
const router = express.Router();
const babySchema = require("../schemas/babySchema");
const vaccinationSchema = require("../schemas/vaccinationSchema")

router.get("/get/:motherorGuardianNIC", async (req, res) => {
    const motherorGuardianNIC = req.params.motherorGuardianNIC;
  
    try {
      const babies = await babySchema.find({ motherorGuardianNIC });
  
      if (!babies || babies.length === 0) {
        return res.status(404).json({ error: "No Babies found" });
      }
  
      return res.status(200).json(babies);
    } catch (err) {
      return res.status(500).json({
        error: "Error while fetching babies",
        message: err.message,
      });
    }
  });

  router.get("/vac/:bid", async (req, res) => {
    const bid = req.params.bid;
  
    try {
      const vaccinations = await vaccinationSchema.find({ bid });
  
      if (!vaccinations || vaccinations.length === 0) {
        return res.status(404).json({ error: "No Vaccinations found" });
      }
  
      return res.status(200).json(vaccinations);
    } catch (err) {
      return res.status(500).json({
        error: "Error while fetching babies",
        message: err.message,
      });
    }
  });

  router.get('/babies/vaccinations/:motherorGuardianNIC', async (req, res) => {
    const motherorGuardianNIC = req.params.nic;
  
    try {
      const babies = await babySchema.find({ motherorGuardianNIC }); // Find babies with the given parent's NIC
  
      if (babies.length === 0) {
        return res.status(404).json({ error: 'No babies found for this parent' });
        console.log("No babies found for this parent");
      }
  
      const babyIds = babies.map(baby => baby.bid); // Get the list of baby IDs
  
      const results = await vaccinationSchema.aggregate([
        { $match: { bid: { $in: babyIds } } }, // Match vaccinations for the babies
        {
          $lookup: {
            from: "babies", // The collection name in the MongoDB database
            localField: "bid",
            foreignField: "bid",
            as: "babyDetails"
          }
        },
        { $unwind: "$babyDetails" }, // Flatten the babyDetails array
        {
          $project: {
            _id: 0,
            "babyDetails.babyName": 1,
            "babyDetails.bid": 1,
            "nextDateTime.date": 1
          }
        },
        {
          $sort: {
            "nextDateTime.date": -1 // Sort by next vaccination date in descending order
          }
        }
      ]);
  
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching babies with vaccinations' });
    }
  });
  
module.exports = router; // Export the router instance