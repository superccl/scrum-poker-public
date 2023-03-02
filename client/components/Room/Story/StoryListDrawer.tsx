import { useRoom } from "@/context/RoomContext"
import CloseIcon from "@mui/icons-material/Close"
import Drawer from "@mui/material/Drawer"
import IconButton from "@mui/material/IconButton"
import AddStoryButton from "../AddStoryButton"
import StoryItem from "./StoryItem"

type StoryListDrawerProps = {
  isOpen: boolean
  onClose: () => void
}
const StoryListDrawer = ({
  isOpen,
  onClose,
}: StoryListDrawerProps) => {
  const { room, stories } = useRoom()
  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: { width: "clamp(30vw, 400px, 95vw)" },
      }}
    >
      <div className="flex flex-col h-[100vh] p-4">
        <div className="flex justify-between items-center">
          <header>
            <h3>Issues</h3>
            <span className="text-light">
              {stories.length} issues
            </span>
          </header>
          <IconButton onClick={onClose}>
            <CloseIcon color="primary" />
          </IconButton>
        </div>
        <section className="flex flex-col flex-1 gap-2 mt-4 overflow-y-auto">
          {stories.map((story, idx) => (
            <StoryItem
              key={story._id.toString()}
              story={story}
              idx={idx}
              isCurrent={room!.currentStoryId === story._id}
            />
          ))}
        </section>
        <AddStoryButton />
      </div>
    </Drawer>
  )
}

export default StoryListDrawer
