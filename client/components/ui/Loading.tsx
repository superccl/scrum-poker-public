import CircularProgress from "@mui/material/CircularProgress"

const Loading = () => {
  return (
    <div className="flex justify-center items-center gap-12 py-1">
      <CircularProgress color="inherit" size={20} />
    </div>
  )
}

export default Loading
