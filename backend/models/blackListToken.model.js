import mongoose from "mongoose";

const blackListTokenSchema = new mongoose.Schema({
    token : {
       type: String,
       required : true,
       unique : true
    },
    createdAt : {
        type : Date,
        default : Date.now,
        expires : 86400 // 24 hrs in seconds
    }
});

export default mongoose.model('BlackListToken',blackListTokenSchema);