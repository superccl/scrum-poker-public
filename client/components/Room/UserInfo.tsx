import { useRoom } from "@/context/RoomContext"
import React from "react"

const UserInfo = () => {
  const { user } = useRoom()
  return <span>{user!.name}</span>
}

export default UserInfo
