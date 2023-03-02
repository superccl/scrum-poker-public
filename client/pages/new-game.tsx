import Navbar from "@/components/Navbar/Navbar"
import { NewRoom, useRoom } from "@/context/RoomContext"
import { FormControl } from "@mui/material"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import TextField from "@mui/material/TextField"
import Head from "next/head"
import { FormEvent, useRef, useState } from "react"
import votingOption from "../data/VotingOption.json"

const NewGame = () => {
  const { createRoom } = useRoom()
  const [votingSystem, setVotingSystem] =
    useState<NewRoom["votingSystem"]>("fibonacci")
  const nameRef = useRef<HTMLInputElement>(null)

  function handleChange(e: SelectChangeEvent) {
    setVotingSystem(e.target.value as NewRoom["votingSystem"])
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const roomInfo: NewRoom = {
      name: nameRef.current!.value.trim() || undefined,
      votingSystem: votingSystem,
    }
    createRoom(roomInfo)
  }
  return (
    <>
      <Head>
        <title>Scrum Poker | Create game</title>
      </Head>
      <Navbar />
      <main className="h-full flex justify-center items-center">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <header>
            Choose a name and a voting system for your game.
          </header>
          <TextField
            inputRef={nameRef}
            label="Game's name"
            variant="outlined"
          />
          <FormControl>
            <InputLabel>Voting System*</InputLabel>
            <Select
              defaultValue={votingSystem}
              id="select-voting-system"
              value={votingSystem}
              label="Voting system"
              onChange={handleChange}
              disabled
              required
            >
              <MenuItem value="fibonacci">
                Fibonacci ({votingOption.fibonacci.join(", ")})
              </MenuItem>
              <MenuItem value="modifiedFibonacci">
                Modified Fibonacci (
                {votingOption.modifiedFibonacci.join(", ")})
              </MenuItem>
            </Select>
          </FormControl>
          <button type="submit" className="btn-primary mt-4">
            Create game
          </button>
        </form>
      </main>
    </>
  )
}

export default NewGame
