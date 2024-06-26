require('dotenv').config();
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const { authMiddleware } = require("./extra/JWT")
require("./database/connections")
const twilio = require('twilio');

const accountSid = 'AC269ae6bb0419cdb03d318c53d0471ba5';
const authToken = '27a924518b3a91c3a343cdfab78bf2be';//process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

if (!accountSid || !authToken) {
    console.error('Twilio credentials are missing. Please check your .env file.');
    process.exit(1);
  }

// const router = require('./routes/adminRoute');

const app = express()
const port = 4000;
app.use(morgan("dev"))
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({
    extended:false
}))

app.use("/public", require("./routes/publicRoute"))
// app.use("/admin",authMiddleware,router);
app.use("/admin", require("./routes/adminRoute"))
app.use("/healthcare", require("./routes/healthofficerRoute"))
app.use("/parent", require("./routes/parentRoute"))

app.listen(port, ()=>{
    console.log(`Server started at post ${port}`)
})      