import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react"
import { io } from "socket.io-client"
import { Date, ObjectId, Types } from "mongoose"
import axios from "axios"
import { useRouter } from "next/router"
import Room from "@/pages/[roomId]"

export type StoryPoint = number | string

export interface Story {
  _id: Types.ObjectId
  name: string
  description?: string
  storyPoint?: StoryPoint
}

export interface Room {
  _id: Types.ObjectId
  votingSystem: "fibonacci" | "modifiedFibonacci"
  name: string
  createdAt: Date
  currentStoryId?: Types.ObjectId
  currentStoryPoint?: StoryPoint
}

export interface User {
  _id: string
  name: string
  email: string
  isConnected: boolean
  currentStoryPoint?: StoryPoint
}

export interface NewUser extends Pick<User, "name" | "email"> {}

export interface NewRoom
  extends Pick<Partial<Room>, "name">,
    Pick<Room, "votingSystem"> {}

export interface NewStory
  extends Pick<Story, "name">,
    Pick<Partial<Story>, "description"> {}

type ItemPatch<T extends { _id: string | Types.ObjectId }> = Pick<
  T,
  "_id"
> &
  Partial<Omit<T, "_id">>

interface CustomError {
  success: false
  message: string
}

interface RoomContextProps {
  room: Room | undefined
  user: User | undefined
  roomUsers: User[]
  stories: Story[]
  isRoomExists: (roomId: string) => Promise<void>
  createRoom: (newRoom: NewRoom) => void
  createUser: (newUser: NewUser) => void
  updateRoom: (
    roomPatchInfo: Omit<Partial<Room>, "_id">
  ) => Promise<void>
  updateUser: (
    userPatchInfo: Omit<Partial<User>, "_id">
  ) => Promise<void>
  addStory: (newStory: NewStory) => Promise<void>
  updateStory: (storyPatchInfo: ItemPatch<Story>) => Promise<void>
  deleteStory: (storyId: Types.ObjectId) => Promise<void>
  resetUserStoryPoints: () => Promise<void>
}

type RoomProviderProps = {
  children: ReactNode
}

const RoomContext = createContext({} as RoomContextProps)

export function useRoom() {
  return useContext(RoomContext)
}

export function RoomProvider({ children }: RoomProviderProps) {
  const [serverPath, _] = useState<string>(
    process.env.NEXT_PUBLIC_BACKEND_URL as string
  )
  const [socket, setSocket] = useState(
    io(serverPath, { transports: ["websocket", "polling"] })
  )
  const [isConnected, setIsConnected] = useState<boolean>(
    socket.connected
  )
  const [room, setRoom] = useState<Room | undefined>(undefined)
  const [user, setUser] = useState<User | undefined>(undefined)
  const router = useRouter()

  const enum ACTION_TYPE {
    INIT,
    CREATE,
    PATCH,
    DELETE,
    RESET,
  }
  type Action<T extends { _id: string | Types.ObjectId }> =
    | { type: ACTION_TYPE.INIT; payload: T[] }
    | { type: ACTION_TYPE.CREATE; payload: { newItem: T } }
    | {
        type: ACTION_TYPE.PATCH
        payload: { itemPatch: ItemPatch<T> }
      }
    | {
        type: ACTION_TYPE.DELETE
        payload: Pick<T, "_id">
      }
    | {
        type: ACTION_TYPE.RESET
        payload: { key: keyof T; value: T[keyof T] }
      }
  function reducer<T extends { _id: string | Types.ObjectId }>(
    state: T[],
    action: Action<T>
  ): T[] {
    switch (action.type) {
      case ACTION_TYPE.INIT:
        return action.payload
      case ACTION_TYPE.CREATE:
        return [...state, action.payload.newItem]

      case ACTION_TYPE.PATCH:
        return state.map((item) =>
          item._id === action.payload.itemPatch._id
            ? { ...item, ...action.payload.itemPatch }
            : item
        )

      case ACTION_TYPE.DELETE:
        return state.filter((item) => item._id !== action.payload._id)

      case ACTION_TYPE.RESET:
        return state.map((item) => ({
          ...item,
          [action.payload.key]: action.payload.value,
        }))
      default:
        return state
    }
  }

  const [roomUsers, usersDispatch] = useReducer<
    (state: User[], action: Action<User>) => User[]
  >(reducer, [])
  const [stories, storiesDispatch] = useReducer<
    (state: Story[], action: Action<Story>) => Story[]
  >(reducer, [])

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true)
    })

    socket.on("getUpdatedRoom", (roomPatchInfo: Room) => {
      setRoom(roomPatchInfo)
    })
    socket.on("getUpdatedUser", (userPatchInfo: { users: User }) => {
      console.log("User patch info received")
      usersDispatch({
        type: ACTION_TYPE.PATCH,
        payload: { itemPatch: userPatchInfo.users },
      })
    })

    socket.on("newStory", (newStory: Story) => {
      storiesDispatch({
        type: ACTION_TYPE.CREATE,
        payload: { newItem: newStory },
      })
    })

    socket.on("deleteStory", (storyId: Types.ObjectId) => {
      storiesDispatch({
        type: ACTION_TYPE.DELETE,
        payload: { _id: storyId },
      })
    })

    socket.on(
      "getUpdatedStory",
      (storyPatchInfo: { stories: Story }) => {
        storiesDispatch({
          type: ACTION_TYPE.PATCH,
          payload: { itemPatch: storyPatchInfo.stories },
        })
      }
    )

    socket.on("resetStoryPoint", () => {
      setUser((user) => ({
        ...user!,
        currentStoryPoint: undefined,
      }))
      usersDispatch({
        type: ACTION_TYPE.RESET,
        payload: { key: "currentStoryPoint", value: undefined },
      })
    })

    socket.on("userConnected", (user) => {
      setNewUser(user)
    })

    socket.on("removeUser", (userId) => {
      console.log("remove user", userId)
      usersDispatch({
        type: ACTION_TYPE.DELETE,
        payload: { _id: userId },
      })
    })

    socket.on("disconnect", () => {
      setIsConnected(false)
      socket.removeAllListeners()
    })

    return () => {
      socket.removeAllListeners()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket])

  useEffect(() => {
    if (
      user &&
      roomUsers.find((roomUser) => roomUser._id === user._id)
    ) {
      usersDispatch({
        type: ACTION_TYPE.PATCH,
        payload: { itemPatch: user },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  function setNewUser(newUser: User) {
    console.log("New user connected")
    usersDispatch({
      type: ACTION_TYPE.CREATE,
      payload: { newItem: newUser },
    })
  }

  async function createRoom(newRoom: NewRoom) {
    try {
      const res = await axios.post(`${serverPath}/room`, newRoom)
      router.push(`/${res.data.result._id}`)
    } catch (err) {
      console.log((err as CustomError).message)
    }
  }

  const isRoomExists = useCallback(async (roomId: string) => {
    try {
      const path = `${serverPath}/room/${roomId}`
      console.log(path)
      const res = await axios.get(path)
      console.log(res.data.result || res.data.message)
      const success: boolean = res.data.success
      if (success) {
        setRoom(res.data.result as Room)
        usersDispatch({
          type: ACTION_TYPE.INIT,
          payload: res.data.result.users,
        })
        storiesDispatch({
          type: ACTION_TYPE.INIT,
          payload: res.data.result.stories,
        })
      }
    } catch (err) {
      setRoom(undefined)
    }
    // disable because the ACTION_TYPE.INIT and serverPath are constant
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function createUser(newUser: NewUser) {
    try {
      if (!room) return
      const user: User = {
        ...newUser,
        _id: socket.id,
        isConnected: socket.connected,
      }
      await axios.post(`${serverPath}/room/${room._id}/user`, user)
      setUser(user)
      setNewUser(user)
      socket.emit("joinRoom", room._id, user)
      router.push(`/${room._id}`)
    } catch (err: unknown) {
      console.log((err as CustomError).message)
    }
  }

  async function updateRoom(
    roomPatchInfo: Omit<Partial<Room>, "_id">
  ) {
    if (Object.hasOwn(roomPatchInfo, "currentStoryId")) {
      resetUserStoryPoints()
    }
    await axios.patch(
      `${serverPath}/room/${room!._id}`,
      roomPatchInfo
    )
    socket.emit("updateRoom", { ...room, ...roomPatchInfo })
    setRoom((room) => ({ ...room!, ...roomPatchInfo }))
  }

  async function updateUser(
    userPatchInfo: Omit<Partial<User>, "_id">
  ) {
    await axios.patch(
      `${serverPath}/room/${room!._id}/user/${user!._id}`,
      userPatchInfo
    )
    socket.emit("updateUser", room!._id, {
      users: { ...user, ...userPatchInfo },
    })
    setUser((user) => ({ ...user!, ...userPatchInfo }))
  }

  async function resetUserStoryPoints() {
    await axios.delete(
      `${serverPath}/room/${room!._id}/deleteCurrentStoryPoint`
    )
    socket.emit("user:resetStoryPoint", room!._id)
  }

  async function addStory(newStory: NewStory) {
    const res = await axios.post(
      `${serverPath}/room/${room!._id}/story`,
      newStory
    )
    if (res.data.success) {
      socket.emit("story:create", room!._id, res.data.result)
    }
  }
  async function updateStory(storyPatchInfo: ItemPatch<Story>) {
    const story = stories.find(
      (story) => story._id === storyPatchInfo._id
    )
    const { _id, ...storyPatchInfoNoId } = storyPatchInfo
    await axios.patch(
      `${serverPath}/room/${room!._id}/story/${storyPatchInfo._id}`,
      storyPatchInfoNoId
    )
    socket.emit("story:update", room!._id, {
      stories: { ...story, ...storyPatchInfo },
    })
    // setStories((stories) =>
    //   stories.map((story) =>
    //     story._id === storyPatchInfo._id
    //       ? { ...story, ...storyPatchInfo }
    //       : story
    //   )
    // )
    storiesDispatch({
      type: ACTION_TYPE.PATCH,
      payload: { itemPatch: storyPatchInfo },
    })
  }

  async function deleteStory(storyId: Types.ObjectId) {
    const res = await axios.delete(
      `${serverPath}/room/${room!._id}/story/${storyId}`
    )
    console.log(res.data)
    if (res.data.success) {
      socket.emit("story:delete", room!._id, storyId)
    }
  }

  return (
    <RoomContext.Provider
      value={{
        room,
        roomUsers,
        stories,
        user,
        isRoomExists,
        createRoom,
        createUser,
        updateRoom,
        updateUser,
        addStory,
        updateStory,
        deleteStory,
        resetUserStoryPoints,
      }}
    >
      {children}
    </RoomContext.Provider>
  )
}
