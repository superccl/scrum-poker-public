import MenuIcon from "@mui/icons-material/Menu"
import Menu from "@mui/material/Menu"
import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import { useState } from "react"
import MenuItem from "@mui/material/MenuItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import { Story, useRoom } from "@/context/RoomContext"

interface StoryItemMenuProps {
  story: Story
}
const StoryItemMenu = ({ story }: StoryItemMenuProps) => {
  const { deleteStory } = useRoom()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const isOpen = Boolean(anchorEl)
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  function handleDelete() {
    deleteStory(story._id)
    handleClose()
  }
  return (
    <>
      <IconButton onClick={handleClick}>
        <MenuIcon />
      </IconButton>
      <Menu
        open={isOpen}
        anchorEl={anchorEl}
        onClose={() => handleClose()}
      >
        <MenuItem onClick={() => handleDelete()}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}

export default StoryItemMenu
