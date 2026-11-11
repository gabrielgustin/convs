"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

// Hace aparecer suavemente el contenido de cada sección de <main> (menos la primera: portada o encabezado)
// al entrar en pantalla. Las grillas aparecen tarjeta por tarjeta. Estilos en app/globals.css.
// Nunca oculta algo que ya está a la vista, y con "reducir movimiento" no hace nada.
export function RevealOnScroll() {
  const pathname = usePathname()

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (/\/(admin|sign-up)/.test(pathname)) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const el = entry.target as HTMLElement
          el.classList.add("is-revealed")
          io.unobserve(el)
          // Al terminar, se quita el marcado para devolverle a la tarjeta sus propias transiciones de hover.
          setTimeout(() => {
            el.removeAttribute("data-reveal")
            el.classList.remove("is-revealed")
            el.style.removeProperty("--reveal-delay")
          }, 1000)
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    )

    const tag = (el: Element, delay = 0) => {
      if (el.hasAttribute("data-reveal-seen")) return
      el.setAttribute("data-reveal-seen", "")
      // Lo que ya se ve queda como está: el contenido visible nunca parpadea ni espera.
      if (el.getBoundingClientRect().top < window.innerHeight) return
      ;(el as HTMLElement).style.setProperty("--reveal-delay", `${delay}ms`)
      el.setAttribute("data-reveal", "")
      io.observe(el)
    }

    const scan = () => {
      document.querySelectorAll("main > section:not(:first-child)").forEach((section) => {
        let box = section.firstElementChild
        // Baja por envoltorios de un solo hijo hasta llegar a los bloques de contenido.
        while (box && box.children.length === 1) box = box.firstElementChild
        Array.from(box?.children ?? []).forEach((child) => {
          const isGrid = getComputedStyle(child).display === "grid" && child.children.length > 1
          if (!isGrid) return tag(child)
          // Tarjetas en orden; el escalonado se corta en 5 para que nada espere demasiado.
          Array.from(child.children).forEach((card, i) => tag(card, Math.min(i, 5) * 80))
        })
      })
    }

    scan()
    // Publicaciones y cursos se cargan después; las tarjetas nuevas también se animan.
    const mo = new MutationObserver(scan)
    mo.observe(document.querySelector("main") ?? document.body, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [pathname])

  return null
}
