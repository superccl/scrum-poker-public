import { NewUser, useRoom } from "@/context/RoomContext"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Head from "next/head"
import { FormEvent, useRef } from "react"
import Navbar from "../Navbar/Navbar"

// Room is available
const Signup = () => {
  const { createUser } = useRoom()
  const emailRef = useRef<HTMLInputElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const user: NewUser = {
      email: emailRef.current!.value.trim(),
      name: nameRef.current!.value.trim(),
    }

    createUser(user)
  }
  return (
    <>
      <Head>
        <title>Scrum Poker | Signup</title>
      </Head>
      <Navbar />
      <main className="h-full flex justify-center items-center">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <header>
            Register your information and join the game.
          </header>
          <TextField
            inputRef={emailRef}
            label="Email"
            variant="outlined"
            type="email"
            required
          />
          <TextField
            inputRef={nameRef}
            label="Display name"
            variant="outlined"
            required
          />
          <button className="btn-primary mt-4">Join the game</button>
        </form>
      </main>
    </>
  )
}

export default Signup
