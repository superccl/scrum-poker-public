import { StoryPoint, useRoom } from "@/context/RoomContext"
import Button from "@mui/material/Button"
import useMediaQuery from "@mui/material/useMediaQuery"
import React, { useEffect, useState } from "react"
import votingOption from "../../data/VotingOption.json"

const StoryPointList = () => {
  const { updateUser, room, user } = useRoom()
  const point = user?.currentStoryPoint
  const [votingOptions, setVotingOptions] = useState<StoryPoint[]>(
    votingOption[room!.votingSystem]
  )
  const matches = useMediaQuery("(max-height:650px)")

  function handleClick(storyPoint: StoryPoint) {
    updateUser({
      currentStoryPoint:
        point === storyPoint ? undefined : storyPoint,
    })
  }
  return (
    <section className="flex flex-col items-center gap-4 sm:m-4">
      {matches || (
        <h3 className="hidden sm:block">Choose Your Card</h3>
      )}
      <p>{point ? `Point: ${point}` : "Not selected"}</p>
      <div className="flex justify-center flex-wrap gap-2">
        {votingOptions.map((storyPoint) => (
          <Button
            key={storyPoint}
            variant={point === storyPoint ? "contained" : "outlined"}
            className={`w-16 ${
              point === storyPoint ? "bg-blue-500" : "bg-inherit"
            }`}
            size="large"
            onClick={() => handleClick(storyPoint)}
          >
            <span className="text-lg">{storyPoint}</span>
          </Button>
        ))}
      </div>
    </section>
  )
}

export default StoryPointList
