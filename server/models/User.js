const mongoose = require("mongoose")
mongoose.set("strictQuery", false)

// localstorage of user [{roomSockedId: userSocketId_1}]
const userSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true,
    alias: "userSocketId",
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  isConnected: {
    type: Boolean,
    default: false,
  },
  currentStoryPoint: {
    type: mongoose.Schema.Types.Mixed,
  },
})

const UserModel = mongoose.model("User", userSchema, "user")

module.exports = { userSchema, UserModel }
