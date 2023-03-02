import { StoryPoint, useRoom } from "@/context/RoomContext"
import React, { useState } from "react"
import Seat from "./Seat"
import { getStat } from "../../util/getStat"

const PokerTable = () => {
  const { room, stories, roomUsers, updateRoom, updateStory } =
    useRoom()
  const isAnySelected = roomUsers.some(
    (user) => user.currentStoryPoint !== undefined
  )

  function showResult() {
    const storyPoints = roomUsers.map(
      (user) => user.currentStoryPoint
    )
    const { average, result } = getStat(
      storyPoints,
      room!.votingSystem
    )
    updateRoom({ currentStoryPoint: average })
    if (room!.currentStoryId) {
      updateStory({
        _id: room!.currentStoryId,
        storyPoint: result,
      })
    }
  }

  function startNewVoting() {
    const currentStoryIdIndex = stories.findIndex(
      (story) => story._id === room?.currentStoryId
    )
    const nextStory = stories[currentStoryIdIndex + 1]
    updateRoom({
      currentStoryPoint: undefined,
      currentStoryId: nextStory ? nextStory._id : undefined,
    })
  }

  return (
    <section
      className="flex-1 p-4 flex justify-center items-center overflow-y-auto"
      style={{ width: "clamp(40vw, 350px, 100vw)" }}
    >
      <div
        style={{
          width: "100%",
          display: "grid",
          height: "300px",
          gridTemplateRows: "1fr 3fr 1fr",
          gridTemplateColumns: "1fr 5fr 1fr",
          gap: "1rem",
          gridTemplateAreas: `
            "left top right" 
            "left table right" 
            "left bottom right"
          `,
        }}
      >
        <div
          className="bg-blue-100 rounded-3xl flex justify-center items-center shadow-lg"
          style={{ gridArea: "table" }}
        >
          {room!.currentStoryPoint !== undefined ? (
            <button
              className="btn-primary"
              onClick={() => startNewVoting()}
            >
              Start new voting
            </button>
          ) : isAnySelected ? (
            <button
              className="btn-primary"
              onClick={() => showResult()}
            >
              Reveal cards
            </button>
          ) : (
            <p>Pick your card!</p>
          )}
        </div>
        {["bottom", "top", "left", "right"].map(
          (position, tableIdx) => (
            <div
              key={position}
              className={`flex ${
                tableIdx < 2 ? "flex-row" : "flex-col"
              } justify-around items-center`}
              style={{ gridArea: position }}
            >
              {roomUsers
                .filter((_, idx) => idx % 4 === tableIdx)
                .map((player) => (
                  <Seat key={player._id} {...player} />
                ))}
            </div>
          )
        )}
      </div>
    </section>
  )
}

export default PokerTable
