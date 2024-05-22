const mongoose = require("mongoose")
const healthcareProfessionalSchema = mongoose.Schema({
    hcpName: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        }
    },
    hcpNIC:{
        type:String,
        required:true,
        unique:true
    },
    hcpPostalCode:{
        type:Number,
        required:true
    },
    hcpEmail:{
        type:String,
        required:true
    },
    hcpTelephone: { 
        type: String,
        required: true
    },
    hcpAddress: { 
        type: String,
        required: true
    },  
    hcpPosition:{
        type:String,
        required:true
    }, 
    hcpAge:{
        type: Number,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    hcpinfo:{
        type:String,
        
    }
})
 module.exports = mongoose.model("Healthcare",healthcareProfessionalSchema)