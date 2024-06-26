require('dotenv').config();
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const { authMiddleware } = require("./extra/JWT")
require("./database/connections")
const twilio = require('twilio');

const accountSid = 'AC4954c15ce342d7b5e858fb758bb57ad2' //process.env.TWILIO_ACCOUNT_SID;
const authToken =  '399d4795db1a740bb411a87994ff07cc'//process.env.TWILIO_AUTH_TOKEN;

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