"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, LogIn } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { LoginDialog } from "./login-dialog"

export function Header() {
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState<'publicaciones' | 'cursos' | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      // En la portada, al pasar la foto principal; en las demás páginas, apenas se baja.
      const threshold = pathname === "/" ? window.innerHeight * 0.85 : 40
      setIsScrolled(window.scrollY > threshold)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Check initial state
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname])

  // Detectar página actual
  useEffect(() => {
    if (pathname.includes('/publicaciones')) {
      setCurrentPage('publicaciones')
    } else if (pathname.includes('/cursos')) {
      setCurrentPage('cursos')
    } else {
      setCurrentPage(null)
    }
  }, [pathname])

  // Bloquear scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  const links = [
    { href: "/", label: "HOME" },
    { href: "/especialidades", label: "ESPECIALIDADES" },
    { href: "/profesionales", label: "PROFESIONALES" },
    { href: "/publicaciones", label: "PUBLICACIONES" },
    { href: "/cursos", label: "CURSOS" },
    { href: "/#contacto", label: "CONTACTO" },
  ]

  const handleAdminClick = () => {
    if (isAuthenticated) {
      if (currentPage === 'publicaciones') {
        window.location.href = '/publicaciones/admin'
      } else if (currentPage === 'cursos') {
        window.location.href = '/cursos/admin'
      }
    } else {
      setLoginOpen(true)
    }
  }

  return (
    <>
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-[#2d3126]/95 shadow-[0_1px_0_rgba(255,255,255,0.06),0_8px_24px_rgba(0,0,0,0.18)]" 
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className={`flex items-center transition-[height] duration-300 ${isScrolled ? "h-16 lg:h-20" : "h-20 lg:h-24"} ${pathname === "/" ? "justify-center" : "justify-between"}`}>
            {/* Logo - Hidden on Home */}
            {pathname !== "/" && (
              <Link href="/" className="flex-shrink-0">
                <Image
                  src="/logo-convs.png"
                  alt="CONVS Abogados Asociados"
                  width={200}
                  height={70}
                  className={`w-auto transition-[height] duration-300 ${isScrolled ? "h-10 lg:h-12" : "h-12 lg:h-16"}`}
                  priority
                />
              </Link>
            )}

            {/* Desktop Navigation */}
            <nav className={`hidden lg:flex items-center gap-8 ${pathname === "/" ? "flex-1 justify-center" : ""}`}>
              {links.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`font-sans text-sm tracking-wider transition-colors ${
                      isActive
                        ? "text-accent font-medium border-b-2 border-accent pb-1"
                        : "text-white/90 hover:text-accent"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            {/* Admin Button + Mobile Menu Button */}
            <div className={`flex items-center gap-3 lg:gap-4 ${pathname === "/" ? "absolute right-4 lg:right-8" : ""}`}>
              {currentPage && (
                <>
                  {/* Desktop Button */}
                  <button
                    onClick={handleAdminClick}
                    className={`hidden sm:inline-flex items-center justify-center p-2 rounded-lg transition-all ${
                      isAuthenticated
                        ? "px-3 lg:px-4 py-2 bg-accent/20 text-accent hover:bg-accent/30"
                        : "text-white/90 hover:text-accent"
                    }`}
                    aria-label={isAuthenticated ? "Panel de administración" : "Ingresar"}
                    title={isAuthenticated ? "Ir al panel admin" : "Iniciar sesión"}
                  >
                    {isAuthenticated ? (
                      <span className="font-sans text-xs lg:text-sm font-medium tracking-wide">Panel Admin</span>
                    ) : (
                      <LogIn size={24} />
                    )}
                  </button>
                  
                  {/* Mobile Login Icon Button */}
                  {!isAuthenticated && (
                    <button
                      onClick={handleAdminClick}
                      className="sm:hidden p-2 text-white/90 hover:text-accent transition-colors"
                      aria-label="Ingresar"
                      title="Iniciar sesión"
                    >
                      <LogIn size={24} />
                    </button>
                  )}
                </>
              )}
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-white/90 hover:text-accent transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation - Full Screen Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 w-full h-screen bg-[#2d3126] z-[100]">
          <div className="flex flex-col h-full">
            {/* Mobile Header */}
            <div className="flex items-center justify-between h-20 px-4">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <Image
                  src="/logo-convs.png"
                  alt="CONVS Abogados Asociados"
                  width={200}
                  height={70}
                  className="h-12 w-auto"
                  priority
                />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-white/90 hover:text-accent transition-colors"
                aria-label="Cerrar menu"
              >
                <X size={28} />
              </button>
            </div>
            
            {/* Navigation Links */}
            <nav className="flex flex-col items-center justify-center flex-1 gap-8">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`font-serif text-2xl tracking-wider transition-colors ${
                    pathname === link.href 
                      ? "text-accent font-medium" 
                      : "text-white/80 hover:text-accent"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            
            {/* Footer Info */}
            <div className="px-6 pb-8 text-center">
              <p className="text-white/50 text-sm">+54 351 522-3799</p>
              <p className="text-white/50 text-sm mt-1">Calle Sucre 135, Piso 2, Of. 3 - Córdoba</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
