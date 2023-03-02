import { ReactNode } from "react"
import Navbar from "../Navbar/Navbar"
type LayoutProps = {
  children: ReactNode
}
export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />
      <>{children}</>
    </>
  )
}
