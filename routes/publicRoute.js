const express = require("express")
const router = express.Router()
const userSchema = require("../schemas/userSchema")
const guardianSchema = require("../schemas/guardianSchema")
const healthcareProfessionalSchema = require("../schemas/healthcareProfessional")
const { generateToken } = require("../extra/JWT")
const bcrypt = require('bcrypt')

// Registration Route
router.post("/register", async (req, res) => {
    try {
      const { firstName, lastName, email, username, password } = req.body;
      console.log("Hello");
      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 10); 
      // Create a new user document
      const newUser = new userSchema({
        name: {
          firstName: firstName,
          lastName: lastName,
        },
        email: email,
        username: username,
        password: hashedPassword,
      });
      console.log(newUser);
      
  
      // Save the user to the database using async/await
      const savedUser = await newUser.save();
  
      return res.send(savedUser); // Send HTTP 201 for resource creation along with the saved user's data
    } catch (err) {
      return res.status(500).send("User registration failed: " + err.message); // Handle database errors
    }
  });

  // Login Route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username == "" || password == "") {
      return res.status(400).send("Username and Password required");
    }

    // Find user by username
    const user = await userSchema.findOne({ username });
    const guardian = await guardianSchema.findOne({ username });
    const healthcareProfessional = await healthcareProfessionalSchema.findOne({ username });

    if (user) {
      // Compare the entered password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).send("Invalid password");
      }
      else{
      // Generate and send JWT token for authentication
      const token = generateToken(user._id,"User");
      //sending the cookie
      res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 });
      console.log(token);
      return res.status(200).json({ userType: "User", token: token });
      }
      
    } else if (guardian) {

      const passwordMatch = await bcrypt.compare(password, guardian.password);
      if (!passwordMatch) {
        return res.status(401).send("Invalid password");
      }
      else{
        const token = generateToken(guardian._id,"Guardian");
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 });
        return res.status(200).json({ userType: "Guardian" , token: token, username:guardian.username, nic:guardian.motherorGuardianNIC });
      }
      
    } else if (healthcareProfessional) {

      const passwordMatch = await bcrypt.compare(password, healthcareProfessional.password);
      if (!passwordMatch) {
        return res.status(401).send("Invalid password");
      }
      else{
        const token = generateToken(healthcareProfessional._id,"Healthcare Professional");
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 });
      return res.status(200).json({ userType: "Healthcare Professional", token: token });
      //return res.status(200).json({ token: generateToken(user._id) });
      }
      
    } else {
      return res.status(404).send("User not found");
    }
  } catch (err) {
    return res.status(500).send("Login failed: " + err.message); // Handle DB error
  }
 
});

module.exports = router;