const mongoose = require("mongoose")
mongoose.set("strictQuery", false)

const storySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  storyPoint: mongoose.Schema.Types.Mixed,
})

const StoryModel = mongoose.model("Story", storySchema, "story")

module.exports = { storySchema, StoryModel }
