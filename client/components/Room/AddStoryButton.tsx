import Button from "@mui/material/Button"
import AddOutlinedIcon from "@mui/icons-material/AddOutlined"
import React, { FormEvent, useRef, useState } from "react"
import TextField from "@mui/material/TextField"
import { NewStory, useRoom } from "@/context/RoomContext"

const AddStoryButton = () => {
  const { addStory } = useRoom()
  const [isExpand, setIsExpand] = useState<boolean>(false)
  const nameRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const newStory: NewStory = {
      name: nameRef!.current!.value.trim(),
      description: descriptionRef!.current!.value.trim(),
    }
    addStory(newStory)
    setIsExpand(false)
  }

  return (
    <div>
      {isExpand ? (
        <form
          onSubmit={handleSubmit}
          className="mt-4 flex flex-col gap-4"
        >
          <TextField
            label="title"
            fullWidth
            autoFocus
            required
            inputRef={nameRef}
          />
          <TextField
            label="description"
            fullWidth
            multiline
            rows={3}
            inputRef={descriptionRef}
          />
          <div className="flex gap-4">
            <button className="btn-primary flex-1">Save</button>
            <button
              className="btn-secondary flex-1"
              type="button"
              onClick={() => setIsExpand(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <Button
          onClick={() => setIsExpand(true)}
          startIcon={<AddOutlinedIcon />}
        >
          Add another issue
        </Button>
      )}
    </div>
  )
}

export default AddStoryButton
