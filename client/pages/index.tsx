import Navbar from "@/components/Navbar/Navbar"
import Head from "next/head"
import Link from "next/link"
import React from "react"

const Home = () => {
  return (
    <>
      <Head>
        <title>Scrum Poker | Home</title>
      </Head>
      <Navbar>
        <Link href="new-game" className="btn-primary">
          Start new game
        </Link>
      </Navbar>
      <main className="flex justify-center items-center">
        <Link href="new-game" className="btn-primary">
          Start new game
        </Link>
      </main>
    </>
  )
}

export default Home
