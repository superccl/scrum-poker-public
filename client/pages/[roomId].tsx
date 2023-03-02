import Navbar from "@/components/Navbar/Navbar"
import NotFound from "@/pages/404"
import Head from "next/head"
import router, { useRouter } from "next/router"
import StoryPointList from "@/components/Room/StoryPointList"
import InviteButton from "@/components/Room/InviteButton"
import ListStoriesButton from "@/components/Room/ListStoriesButton"
import PokerTable from "@/components/Room/PokerTable"
import Signup from "@/components/Room/Signup"
import { useRoom } from "@/context/RoomContext"
import { useEffect, useState } from "react"
import VotingResult from "@/components/Room/VotingResult"
import UserInfo from "@/components/Room/UserInfo"
import Loading from "@/components/ui/Loading"
import { GetServerSideProps } from "next"
import axios from "axios"

type RoomProps = {
  success: boolean
}
const Room = ({ success }: RoomProps) => {
  if (!success) return <NotFound />

  // Step 1: Room Logic (without socket)
  const router = useRouter()
  const { room, stories, user, isRoomExists } = useRoom()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!router.isReady) return
    const { roomId } = router.query
    console.log("RoomID", roomId)
    if (!roomId) return
    isRoomExists(roomId as string).then(() => setIsLoading(false))
  }, [router.isReady, router.query, isRoomExists])

  if (isLoading) return <Loading />

  if (!room) return <NotFound />

  // Step 2: User (Socket) Logic
  if (!user) return <Signup />

  return (
    <>
      <Head>
        <title>Scrum Poker | Room</title>
      </Head>
      <Navbar>
        <div className="flex items-center gap-4">
          <UserInfo />
          <InviteButton />
          <ListStoriesButton />
        </div>
      </Navbar>
      <main className="flex flex-col items-center p-4">
        <span>{room.name}</span>
        {room.currentStoryId && (
          <span>
            Voting:{" "}
            {
              stories.find(
                (story) => story._id === room!.currentStoryId
              )!.name
            }
          </span>
        )}
        <PokerTable />
        {room.currentStoryPoint === undefined ? (
          <StoryPointList />
        ) : (
          <VotingResult />
        )}
      </main>
    </>
  )
}

export async function getServerSideProps(context: {
  params: { roomId: string }
}) {
  const roomId = context.params.roomId as string
  const path = process.env.NEXT_PUBLIC_BACKEND_URL + "/room/" + roomId
  const res = await axios.get(path)
  const success = res.data.success
  return {
    props: {
      success,
    },
  }
}

export default Room
