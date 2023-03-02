import { Story, useRoom } from "@/context/RoomContext"
import StoryItemMenu from "./StoryItemMenu"
import StoryPointButton from "./StoryPointButton"

interface StoryItemProps {
  story: Story
  idx: number
  isCurrent: boolean
}
const StoryItem = ({ story, idx, isCurrent }: StoryItemProps) => {
  const { updateRoom } = useRoom()
  return (
    <div className="shadow p-4">
      <div className="flex justify-between items-center">
        <header>
          <p className="text-light">pp-{idx + 1}</p>
          <p className="mt-1">{story.name}</p>
        </header>
        <StoryItemMenu story={story} />
      </div>
      <div className="flex justify-between mt-4">
        {isCurrent ? (
          <button
            className="btn-primary"
            onClick={() => updateRoom({ currentStoryId: undefined })}
          >
            Voting...
          </button>
        ) : (
          <button
            className="btn-secondary"
            onClick={() => updateRoom({ currentStoryId: story._id })}
          >
            Vote this issue
          </button>
        )}
        <StoryPointButton story={story} />
      </div>
    </div>
  )
}

export default StoryItem
