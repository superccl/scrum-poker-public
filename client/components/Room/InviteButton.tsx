import Button from "@mui/material/Button"
import React, { useState } from "react"
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import Modal from "@mui/material/Modal"
import Box from "@mui/material/Box"
import { useRouter } from "next/router"
import IconButton from "@mui/material/IconButton"
import Snackbar from "@mui/material/Snackbar"

const InviteButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false)
  const router = useRouter()
  const url = `${process.env.NEXT_PUBLIC_FRONTEND_URL}${router.asPath}`

  function handleCopy() {
    navigator.clipboard.writeText(url)
    setIsOpen(false)
    setIsSnackbarOpen(true)
  }
  return (
    <>
      <Button
        variant="outlined"
        startIcon={<PersonAddAltOutlinedIcon />}
        onClick={() => setIsOpen(true)}
      >
        <span>Invite</span>
      </Button>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <span className="text-sm sm:text-md">{url}</span>
          <IconButton onClick={() => handleCopy()}>
            <ContentCopyIcon />
          </IconButton>
        </Box>
      </Modal>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={isSnackbarOpen}
        onClose={() => setIsSnackbarOpen(false)}
        message="Invitation link copied to clipboard!"
        autoHideDuration={5000}
      />
    </>
  )
}

export default InviteButton
