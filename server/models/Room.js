const mongoose = require("mongoose")
mongoose.set("strictQuery", false)
const { storySchema, StoryModel } = require("./Story")
const { userSchema, UserModel } = require("./User")

const roomSchema = new mongoose.Schema(
  {
    votingSystem: {
      type: String,
      enum: {
        values: ["fibonacci", "modifiedFibonacci"],
        message: "{VALUE} is not supported",
      },
      default: "fibonacci",
    },
    name: {
      type: String,
      default: "New poker game",
    },
    createdAt: {
      type: Date,
      immutable: true,
      default: () => Date.now(),
    },
    stories: {
      type: [storySchema],
      default: [
        { name: "implement chat feature" },
        { name: "add KYC UI to back office" },
        { name: "create FX market stop order" },
      ],
    },
    currentStoryId: {
      type: mongoose.Types.ObjectId,
      ref: "Story",
    },
    currentStoryPoint: {
      type: mongoose.Schema.Types.Mixed,
    },
    users: [userSchema],
  },
  {
    toJSON: { virtuals: true },
  }
)

roomSchema.virtual("liveUsers").get(function () {
  return this.users.filter((user) => user.isLive)
})

module.exports = mongoose.model("Room", roomSchema, "room")
