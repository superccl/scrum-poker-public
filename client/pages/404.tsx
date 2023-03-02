import Head from "next/head"
import Navbar from "../components/Navbar/Navbar"
import Image from "next/image"
import Link from "next/link"
const NotFound = () => {
  return (
    <>
      <Head>
        <title>Scrum Poker | 404 Not Found</title>
      </Head>
      <Navbar />
      <main className="flex flex-col items-center md:flex-row md:justify-center gap-12">
        <div className="flex flex-col gap-4">
          <div
            className="relative aspect-video"
            style={{ width: "clamp(25vw, 300px, 75vw)" }}
          >
            <Image
              src={"/assets/404.svg"}
              alt="A cartoon picture showing 404"
              fill
            />
          </div>
          <h2>Page Not Found</h2>
          <p>Sorry, we cannot find what you are looking for.</p>
          <Link href="/" className="btn-primary mt-4">
            Go Back
          </Link>
        </div>
        <div
          className="relative aspect-square"
          style={{ width: "clamp(30vw, 500px, 80vw)" }}
        >
          <Image
            src={"/assets/astronaut.svg"}
            alt="A astronaut picture for 404 not found page"
            fill
          />
        </div>
      </main>
    </>
  )
}

export default NotFound
