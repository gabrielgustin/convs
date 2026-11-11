"use client"

import { useEffect, useRef } from "react"

// Fondo de la portada (desenfoque y oscurecido ya vienen en la imagen) con profundidad leve: baja al 25% de la velocidad del scroll.
// Solo mientras la portada está a la vista y sin "reducir movimiento".
export function HeroBackground() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let frame = 0
    const update = () => {
      frame = 0
      const y = Math.min(window.scrollY, window.innerHeight)
      if (ref.current) ref.current.style.transform = `translate3d(0, ${y * 0.25}px, 0)`
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="absolute inset-0 bg-cover bg-no-repeat will-change-transform"
      style={{
        backgroundImage: "url('/team-office-background.jpg')",
        backgroundPosition: "50% center",
        backgroundSize: "cover",
      }}
    />
  )
}
