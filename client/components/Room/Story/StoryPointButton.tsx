import { Story, StoryPoint, useRoom } from "@/context/RoomContext"
import ListItemIcon from "@mui/material/ListItemIcon"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import React, { useState } from "react"
import StoryPointList from "../StoryPointList"
import votingOption from "../../../data/VotingOption.json"
import Button from "@mui/material/Button"

interface StoryPointButtonProps {
  story: Story
}

const StoryPointButton = ({ story }: StoryPointButtonProps) => {
  const { room, updateStory } = useRoom()
  const [votingOptions, setVotingOptions] = useState<StoryPoint[]>(
    votingOption[room!.votingSystem]
  )
  const point = story.storyPoint
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const isOpen = Boolean(anchorEl)
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  function handleSelect(storyPoint: StoryPoint) {
    updateStory({
      _id: story._id,
      storyPoint: point === storyPoint ? undefined : storyPoint,
    })
    handleClose()
  }
  return (
    <>
      <button className="btn-secondary" onClick={handleOpen}>
        {story.storyPoint === undefined ? "-" : story.storyPoint}
      </button>
      <Menu
        open={isOpen}
        anchorEl={anchorEl}
        onClose={() => handleClose()}
      >
        <div
          className="flex justify-center flex-wrap gap-2"
          style={{ maxWidth: "300px" }}
        >
          {votingOptions.map((storyPoint) => (
            <Button
              key={storyPoint}
              variant={
                point === storyPoint ? "contained" : "outlined"
              }
              className={`w-16 ${
                point === storyPoint ? "bg-blue-500" : "bg-inherit"
              }`}
              size="large"
              onClick={() => handleSelect(storyPoint)}
            >
              <span className="text-lg">{storyPoint}</span>
            </Button>
          ))}
        </div>
      </Menu>
    </>
  )
}

export default StoryPointButton
