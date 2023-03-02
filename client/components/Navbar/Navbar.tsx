import Link from "next/link"
import React, { ReactNode } from "react"

type NavbarProps = {
  children?: ReactNode
}

const Navbar = ({ children }: NavbarProps) => {
  return (
    <nav className="flex justify-between items-center shadow px-4 h-16">
      <header className="text-lg">
        <Link href="/" className="hidden sm:inline">
          Scrum Poker
        </Link>
      </header>
      {children ? <div>{children}</div> : null}
    </nav>
  )
}

export default Navbar
