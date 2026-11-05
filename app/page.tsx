import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Professionals } from "@/components/professionals"
import { Specialties } from "@/components/specialties"
import { About } from "@/components/about"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Hero />
        <Professionals />
        <Specialties />
        <About />
        <Contact />
        <Footer />
      </main>
    </>
  )
}
