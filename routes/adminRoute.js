const express = require("express");
const router = express.Router();
const healthcareProfessionalSchema = require("../schemas/healthcareProfessional");
const ParentSchema = require("../schemas/guardianSchema");
const babySchema = require("../schemas/babySchema");
const vaccinationSchema = require("../schemas/vaccinationSchema")
const bcrypt = require('bcrypt')

module.exports = router;

//Healthcare Professional Account Creation
router.post("/create-health-acc", async (req, res) => {
    try {
        const { firstName, lastName, nic, postalCode, email, username, password ,telephone,position,age,info} = req.body;
        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10); 
        const newHealthAcc = new healthcareProfessionalSchema({
            hcpName: {
              firstName: firstName,
              lastName: lastName,
            },
            hcpNIC: nic,
            hcpPostalCode: postalCode,
            hcpEmail: email,
            hcpTelephone: telephone,
            hcpAddress: telephone,
            hcpPosition: position,
            hcpAge: age,
            hcpinfo:info,
            username: username,
            password: hashedPassword
        });

        // Save the new account to the database using async/await
        const savedHealthAccount = await newHealthAcc.save();

        return res.status(201).send(savedHealthAccount); // Sending the saved account's data with HTTP 201
    } catch (err) {
        return res.status(500).send("Account creation failed: " + err.message); // Handle database errors
    }
});

//Edit Healthcare Professional Account
router.put("/update-health-acc/:nic", async (req, res) => {
  try {
    const nic = req.params.nic;
    //In request body use Schema Attributes
    const updateData = req.body;
    console.log(updateData);
    const account = await healthcareProfessionalSchema.findOneAndUpdate(
      { hcpNIC: nic },
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


//Healthcare Professional Account Deletion
router.delete("/delete-helath-acc/:nic", async (req, res) => {
    const nic = req.params.nic;
  
    try {
      const result = await healthcareProfessionalSchema.findOneAndDelete({ hcpNIC: nic });
  
      if (!result) {
        return res.status(404).json({ error: "Health Professional Account not found" });
      }
  
      return res.status(200).json({ message: "Health Professional Account removed" });
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Error while deleting account", message: err.message });
    }
  });



  //Mother or Guardian Account Creation
router.post("/create-parent-acc", async (req, res) => {
  try {
      const { mfirstName, mlastName, mnic, address ,postalcode, email,telephone, username, password,info } = req.body;
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
          password:hashedPassword,
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

//Parent Account Deletion
router.delete("/delete-parent-acc/:nic", async (req, res) => {
  const nic = req.params.nic;

  try {
    const result = await ParentSchema.findOneAndDelete({ motherorGuardianNIC: nic });

    if (!result) {
      return res.status(404).json({ error: "Parent Account not found" });
    }

    return res.status(200).json({ message: "Parent Account removed" });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Error while deleting account", message: err.message });
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
      { bid: babyId },
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

//Baby Account Deletion
router.delete("/delete-baby-acc/:babyId", async (req, res) => {
  const babyId = req.params.babyId;

  try {
    const result = await babySchema.findOneAndDelete({ bid: babyId });

    if (!result) {
      return res.status(404).json({ error: "Baby Account not found" });
    }

    return res.status(200).json({ message: "Baby Account removed" });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Error while deleting account", message: err.message });
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
    const { babyId, vaccine,vaccineNo, vaccinator, bcode, location, nextDate, nextTime, status } = req.body;

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
      status:"Approved"
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

//Vaccination Details Deletion
router.delete("/delete-vacc/:bcode", async (req, res) => {
  const bcode = req.params.bcode;

  try {
    const result = await vaccinationSchema.findOneAndDelete({ bottle_code: bcode });

    if (!result) {
      return res.status(404).json({ error: "Vaccination details not found" });
    }

    return res.status(200).json({ message: "Vaccination Details removed" });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Error while deleting account", message: err.message });
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

// Route to get all healthcare
router.get("/healthcares", async (req, res) => {
  try {
      const healthcares = await healthcareProfessionalSchema.find();
      res.status(200).json(healthcares);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

// Fetch parent information based on NIC
router.get('/get-parent-acc/:nic', async (req, res) => {
  try {
    const nic = req.params.nic;
    const account = await ParentSchema.findOne({ motherorGuardianNIC: nic });

    if (!account) {
      return res.status(404).send('Account not found');
    }

    return res.status(200).send(account);
  } catch (err) {
    return res.status(500).send('Error while fetching account information: ' + err.message);
  }
});

// Fetch healthcare information based on nic
router.get('/get-health-acc/:nic', async (req, res) => {
  try {
    const nic = req.params.nic;
    const account = await healthcareProfessionalSchema.findOne({ hcpNIC: nic });

    if (!account) {
      return res.status(404).send('Account not found');
    }

    return res.status(200).send(account);
  } catch (err) {
    return res.status(500).send('Error while fetching account information: ' + err.message);
  }
});


// Route to get the count of healthcare professionals
router.get("/healthcares/count", async (req, res) => {
  try {
      const count = await healthcareProfessionalSchema.countDocuments();
      res.status(200).json({ count });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

// Route to get the count of Babies
router.get("/babies/count", async (req, res) => {
  try {
      const count = await babySchema.countDocuments();
      res.status(200).json({ count });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

// Route to get the count of parents
router.get("/parents/count", async (req, res) => {
  try {
      const count = await ParentSchema.countDocuments();
      res.status(200).json({ count });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

// Route to get the count of vaccinations
router.get("/vaccinations/count", async (req, res) => {
  try {
      const count = await vaccinationSchema.countDocuments();
      res.status(200).json({ count });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

// Endpoint to get next vaccination date and parents' mobile number by bottle_code
router.get('/vaccination/:bottle_code', async (req, res) => {
  try {
    const bottleCode = req.params.bottle_code;

    // Find the vaccination record by bottle_code
    const vaccination = await vaccinationSchema.findOne({ bottle_code: bottleCode });
    if (!vaccination) {
      return res.status(404).json({ error: 'Vaccination record not found' });
    }

    // Find the baby record by bid (baby ID)
    const baby = await babySchema.findOne({ bid: vaccination.bid });
    if (!baby) {
      return res.status(404).json({ error: 'Baby record not found' });
    }

    // Find the parent record by mother's NIC
    const parent = await ParentSchema.findOne({ motherorGuardianNIC: baby.motherorGuardianNIC });
    if (!parent) {
      return res.status(404).json({ error: 'Parent record not found' });
    }

    // Respond with the next vaccination date and parents' mobile number
    res.json({
      nextVaccinationDate: vaccination.nextDateTime.date,
      nextVaccinationTime: vaccination.nextDateTime.time,
      parentMobileNumber: parent.guardianTelephoneNumber
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; // Export the router instance
