import IconButton from "@mui/material/IconButton"
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered"
import { useState } from "react"
import StoryListDrawer from "./Story/StoryListDrawer"

const ListStoriesButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  return (
    <>
      <IconButton onClick={() => setIsOpen(true)}>
        <FormatListNumberedIcon fontSize="large" color="primary" />
      </IconButton>
      <StoryListDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}

export default ListStoriesButton
