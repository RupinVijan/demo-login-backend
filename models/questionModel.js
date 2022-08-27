const mongoose = require("mongoose");

const quesSchema = mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel",
  },
  question:{
    type:String,
    required:true
  },
  
}, {
  timestamps: true
});
module.exports = mongoose.model("questions", quesSchema);