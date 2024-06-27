const express = require("express");
const router = express.Router();
const ParentSchema = require("../schemas/guardianSchema");
const babySchema = require("../schemas/babySchema");
const vaccinationSchema = require("../schemas/vaccinationSchema");
const bcrypt = require('bcrypt')
const saltRounds = 10; // Define saltRounds

//Mother or Guardian Account Creation
router.post("/create-parent-acc", async (req, res) => {
    try {
        const { mfirstName, mlastName, mnic, address ,postalcode, email,telephone, username, password ,info} = req.body;
        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);
        const newParentAcc = new ParentSchema({
            motherorGuardianName: {
              firstName: mfirstName,
              lastName: mlastName,
            },
            motherorGuardianNIC: mnic,
            Address: address,
            PostalCode: postalcode,
            guardianEmail: email,
            guardianTelephoneNumber: telephone,
            username: username,
            password: hashedPassword,
            additionalInfo:info
        });

        // Save the new account to the database using async/await
        const savedParentAccount = await newParentAcc.save();

        return res.status(201).send(savedParentAccount); // Sending the saved account's data with HTTP 201
    } catch (err) {
        return res.status(500).send("Account creation failed: " + err.message); // Handle database errors
    }
});

//Edit Parent Account
router.put("/update-parent-acc/:nic", async (req, res) => {
    try {
      const nic = req.params.nic;
      //In request body use Schema Attributes
      const updateData = req.body;

      // Check if the password is being updated
    if (updateData.password) {
      // Hash the new password before saving
      const hashedPassword = await bcrypt.hash(updateData.password, saltRounds);
      updateData.password = hashedPassword;
    }
    
      console.log(updateData);
      const account = await ParentSchema.findOneAndUpdate(
        { motherorGuardianNIC: nic },
        { $set: updateData },
        { new: true }
      );
  
      if (!account) {
        return res.status(404).send("Account not found");
      }
  
      return res.status(200).send(account);
    } catch (err) {
      return res
        .status(500)
        .send("Error while updating account information: " + err.message);
    }
  });

//Baby Account Creation
router.post("/create-baby-acc", async (req, res) => {
  try {
    const {mfirstName, mlastName, mnic, gender, ofc , birthDate ,birthweight , birthHospital, fatherName, fatherNic} = req.body;
    const babyId = Math.floor(Math.random() * 100000000);

    const newBabyAcc = new babySchema({
      babyName: {
        firstName: mfirstName,
        lastName: mlastName,
      },
      motherorGuardianNIC: mnic,
      fatherName:fatherName,
      fatherNic: fatherNic,
      bid: babyId,
      gender: gender,
      ofc: ofc,
      birthDate: birthDate,
      weight: birthweight,
      hospitalName: birthHospital
    });

    // Save the new account to the database using async/await
    const savedBabyAccount = await newBabyAcc.save();

    return res.status(201).send({savedBabyAccount,babyId}); // Send HTTP 201 for resource creation along with the saved account's data
  } catch (err) {
    return res.status(500).send("Account creation failed: " + err.message); // Handle database errors
  }
});

//Edit Baby Account
router.put("/update-baby-acc/:babyId", async (req, res) => {
  try {
    const babyId = req.params.babyId;
    //In request body use Schema Attributes
    const updateData = req.body;
    console.log(updateData);
    const account = await babySchema.findOneAndUpdate(
      { Bid: babyId },
      updateData,
      { new: true }
    );

    if (!account) {
      return res.status(404).send("Account not found");
    }

    return res.status(200).send(account);
  } catch (err) {
    return res
      .status(500)
      .send("Error while updating account information: " + err.message);
  }
});

// Get Baby Acount Details
router.get("/baby-acc-info/:babyId",async(req,res) => {
  try{
      const {babyId} = req.params;
      const account = await babySchema.findOne({bid:babyId});

      if(!account){
        return res.status(400).send("Account not found");
      }
      return res.status(200).send(account);

  }catch(err){
    return res
    .status(500)
    .send("Error while fetching Account Information: "+ err.message);
  }
})

// Baby Vaccination Adding
router.post("/vacc-adding", async (req, res) => {
  try {
    const { babyId, vaccine,vaccineNo, vaccinator, bcode, location, nextTime, nextDate, status } = req.body;

    const newVaccine = new vaccinationSchema({
      bid: babyId,
      vacname: vaccine,
      vaccineNo,
      vaccinator,
      bottle_code: bcode,
      "dateTime.date": new Date().toLocaleDateString(),
      "dateTime.time": new Date().toLocaleTimeString(),
      location,
      "nextDateTime.date": nextDate,
      "nextDateTime.time": nextTime,
      status: "Pending",
      dataEnterd: "Healthcare"
    });

    // Save the new vaccine to the database using async/await
    const savedVaccination = await newVaccine.save();

    return res.status(201).send(savedVaccination); // Send HTTP 201 for resource creation along with the saved vaccination data
  } catch (err) {
    return res.status(500).send("Vaccination Adding failed: " + err.message); // Handle database errors
  }
});

//Update Vaccination Details
router.put("/update-vacc/:bcode", async (req, res) => {
  try {
    const bcode = req.params.bcode;
    //In request body use Schema Attributes
    const updateData = req.body;
    console.log(updateData);
    const details = await vaccinationSchema.findOneAndUpdate(
      { bottle_code: bcode },
      updateData,
      { new: true }
    );

    if (!details) {
      return res.status(404).send("Vacc Details not found");
    }

    return res.status(200).send(details);
  } catch (err) {
    return res
      .status(500)
      .send("Error while updating vaccination details: " + err.message);
  }
});

// Get Vaccinarion Histroy of Child
router.get("/vacc-history/:babyId", async (req, res) => {
  const bid = req.params.babyId;

  try {
    const vaccinations = await vaccinationSchema.find({ bid });

    if (!vaccinations) {
      return res.status(404).json({ error: "No vaccination history found" });
    }

    return res.status(200).json(vaccinations);
  } catch (err) {
    return res.status(500).json({
      error: "Error while fetching vaccinations",
      message: err.message,
    });
  }
});

// Route to get all babies
router.get("/babies", async (req, res) => {
  try {
      const babies = await babySchema.find();
      res.status(200).json(babies);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

// Route to get all parents
router.get("/parents", async (req, res) => {
  try {
      const parents = await ParentSchema.find();
      res.status(200).json(parents);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

// Route to get all vaccinations
router.get("/vaccinations", async (req, res) => {
  try {
      const vanccinations = await vaccinationSchema.find();
      res.status(200).json(vanccinations);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});


module.exports = router; // Export the router instance
