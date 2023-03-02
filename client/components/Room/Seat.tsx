import { User, useRoom } from "@/context/RoomContext"

const Seat = (player: User) => {
  const { room } = useRoom()
  const isShow = room!.currentStoryPoint === undefined ? false : true
  return (
    <div className="flex flex-col items-center w-14 gap-1">
      <div
        className={`${
          player.currentStoryPoint ? "bg-blue-500" : "bg-gray-200"
        } w-8 h-12 rounded flex justify-center items-center`}
      >
        {isShow && (
          <span className="text-xl text-white">
            {player.currentStoryPoint}
          </span>
        )}
      </div>
      <span className="text-center whitespace-nowrap">
        {player.name}
      </span>
    </div>
  )
}

export default Seat
