import { useRoom } from "@/context/RoomContext"

const VotingResult = () => {
  const { room } = useRoom()

  return (
    <section>
      <h3>Voting result</h3>
      <p>Average: {room?.currentStoryPoint!}</p>
    </section>
  )
}

export default VotingResult
