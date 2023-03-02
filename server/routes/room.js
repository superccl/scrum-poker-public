const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()
const RoomModel = require("../models/Room")
const { StoryModel } = require("../models/Story")

// pass

router.post("/", async (req, res) => {
  const room = req.body
  try {
    const newRoom = new RoomModel(room)
    await newRoom.save((err, body) => {
      if (err) {
        res.json({ success: false, result: err.message })
      } else {
        const newRoomId = body._id
        console.log(`New room ${newRoomId} is created!`)
        res.json({ success: true, result: body })
      }
    })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
})

router
  .route("/:id")
  .get((req, res) => {
    RoomModel.findById(req.params.id, (err, doc) => {
      if (err) {
        res.json({ success: false, message: err.message })
      } else {
        res.json({ success: true, result: doc })
      }
    })
  })
  .patch(async (req, res) => {
    try {
      const doc = await RoomModel.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { upsert: true, new: true }
      )
      res.json({ success: true, result: doc })
    } catch (err) {
      res.json({ success: false, message: err.message })
    }
  })

router.route("/:id/user").post((req, res) => {
  RoomModel.updateOne(
    { _id: req.params.id },
    { $push: { users: req.body } }
  )
    .then((result) => res.json({ success: true, result: result }))
    .catch((err) =>
      res.json({ success: false, message: err.message })
    )
})

router.delete("/:id/deleteCurrentStoryPoint", (req, res) => {
  RoomModel.updateOne(
    {
      _id: req.params.id,
      "users.currentStoryPoint": { $exists: true },
    },

    { $unset: { "users.$[].currentStoryPoint": true } },
    { multi: true }
  )
    .then((result) => res.json({ success: true, result: result }))
    .catch((err) =>
      res.json({ success: false, message: err.message })
    )
})

router
  .route("/:id/user/:userId")
  .get((req, res) => {
    RoomModel.findById(req.params.id, (err, parent) => {
      if (err) {
        res.json({ success: false, message: err.message })
      } else {
        const user = parent?.users.id(req.params.userId)
        res.json({ success: true, result: user })
      }
    })
  })
  .patch((req, res) => {
    RoomModel.findById(req.params.id, (err, parent) => {
      if (err) {
        res.json({ success: false, message: err.message })
      } else {
        user = parent.users.id(req.params.userId)
        Object.keys(req.body).forEach(
          (key) => (user[key] = req.body[key])
        )
        parent?.save()
        res.json({ success: true, result: user })
      }
    })
  })
  .delete((req, res) => {
    RoomModel.updateOne(
      { _id: req.params.id },
      { $pull: { users: { _id: req.params.userId } } }
    )
      .then((result) => res.json({ success: true, result: result }))
      .catch((err) =>
        res.json({ success: false, message: err.message })
      )
  })

router.post("/:id/story", (req, res) => {
  const newStory = new StoryModel(req.body)
  RoomModel.updateOne(
    { _id: req.params.id },
    { $push: { stories: newStory } },
    { new: true },
    (err, result) => {
      if (err) {
        res.json({ success: false, message: err.message })
      } else {
        res.json({ success: true, result: newStory })
      }
    }
  )
})

router
  .route("/:id/story/:storyId")
  .get((req, res) => {
    RoomModel.findById(req.params.id, (err, parent) => {
      if (err) {
        res.json({ success: false, message: err.message })
      } else {
        const story = parent?.stories.id(
          mongoose.Types.ObjectId(req.params.storyId)
        )
        res.json({ success: true, result: story })
      }
    })
  })
  .patch((req, res) => {
    RoomModel.findById(req.params.id, (err, parent) => {
      if (err) {
        res.json({ success: false, message: err.message })
      } else {
        story = parent.stories.id(
          mongoose.Types.ObjectId(req.params.storyId)
        )
        Object.keys(req.body).forEach(
          (key) => (story[key] = req.body[key])
        )
        parent?.save()
        res.json({ success: true, result: story })
      }
    })
  })
  .delete((req, res) => {
    RoomModel.updateOne(
      { _id: req.params.id },
      { $pull: { stories: { _id: req.params.storyId } } }
    )
      .then((result) => res.json({ success: true, result: result }))
      .catch((err) =>
        res.json({ success: false, message: err.message })
      )
  })

module.exports = router
