'use client'

import { useState, useEffect } from 'react'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Calendar, User } from "lucide-react"
import type { Publicacion } from "@/lib/storage"

interface PublicacionDisplay extends Publicacion {
  author?: string
  category?: string
  image?: string
}

export default function PublicacionesPage() {
  const [publicaciones, setPublicaciones] = useState<PublicacionDisplay[]>([])

  useEffect(() => {
    fetch('/api/publicaciones')
      .then((response) => response.ok ? response.json() : [])
      .then((stored: PublicacionDisplay[]) => setPublicaciones(stored.length ? stored : defaultPublicaciones))
      .catch(() => setPublicaciones(defaultPublicaciones))
  }, [])

  const defaultPublicaciones: PublicacionDisplay[] = [
    {
      id: "1",
      titulo: "Nuevas reformas en el Código Civil y Comercial",
      descripcion: "Análisis detallado de las últimas modificaciones al Código Civil y Comercial y su impacto en las relaciones contractuales.",
      contenido: "Análisis detallado de las últimas modificaciones al Código Civil y Comercial y su impacto en las relaciones contractuales.",
      fecha: "15 de Noviembre, 2024",
      category: "Derecho Civil",
      author: "Dr. Juan Carlos Martínez",
      image: "/legal-documents-and-books.jpg",
    },
    {
      id: "2",
      titulo: "Derechos de los trabajadores en el contexto actual",
      descripcion: "Guía completa sobre los derechos laborales vigentes y cómo protegerlos en el ámbito judicial y extrajudicial.",
      contenido: "Guía completa sobre los derechos laborales vigentes y cómo protegerlos en el ámbito judicial y extrajudicial.",
      fecha: "2 de Noviembre, 2024",
      category: "Derecho Laboral",
      author: "Dr. Roberto Silva",
      image: "/office-workers-rights.jpg",
    },
    {
      id: "3",
      titulo: "Aspectos clave en la disolución del matrimonio",
      descripcion: "Consideraciones fundamentales a tener en cuenta durante un proceso de divorcio, desde lo emocional hasta lo legal.",
      contenido: "Consideraciones fundamentales a tener en cuenta durante un proceso de divorcio, desde lo emocional hasta lo legal.",
      fecha: "20 de Octubre, 2024",
      category: "Derecho de Familia",
      author: "Dra. María Fernanda López",
      image: "/family-law-consultation.jpg",
    },
    {
      id: "4",
      titulo: "Compraventa de inmuebles: Lo que debe saber",
      descripcion: "Todo lo que necesita conocer antes de comprar o vender una propiedad, desde la oferta hasta la escrituración.",
      contenido: "Todo lo que necesita conocer antes de comprar o vender una propiedad, desde la oferta hasta la escrituración.",
      fecha: "5 de Octubre, 2024",
      category: "Derecho Inmobiliario",
      author: "Dra. Ana Sofía Romero",
      image: "/real-estate-property-documents.jpg",
    },
    {
      id: "5",
      titulo: "Sucesiones: Planificación patrimonial",
      descripcion: "Importancia de la planificación sucesoria y las herramientas legales disponibles para proteger su patrimonio familiar.",
      contenido: "Importancia de la planificación sucesoria y las herramientas legales disponibles para proteger su patrimonio familiar.",
      fecha: "18 de Septiembre, 2024",
      category: "Derecho Sucesorio",
      author: "Dr. Juan Carlos Martínez",
      image: "/estate-planning-documents.jpg",
    },
    {
      id: "6",
      titulo: "Contratos comerciales: Errores comunes",
      descripcion: "Los errores más frecuentes al redactar contratos comerciales y cómo evitarlos para proteger sus intereses empresariales.",
      contenido: "Los errores más frecuentes al redactar contratos comerciales y cómo evitarlos para proteger sus intereses empresariales.",
      fecha: "3 de Septiembre, 2024",
      category: "Derecho Comercial",
      author: "Dr. Juan Carlos Martínez",
      image: "/business-contract-signing.jpg",
    },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="pt-28 lg:pt-36 pb-16 lg:pb-24 bg-secondary">
          <div className="container mx-auto px-4 lg:px-8">
            <h1 className="font-serif text-4xl lg:text-6xl text-secondary-foreground text-center mb-6">
              Publicaciones
            </h1>
            <p className="font-sans text-lg text-secondary-foreground/80 text-center max-w-3xl mx-auto leading-relaxed">
              Artículos, análisis y actualizaciones sobre temas legales relevantes elaborados por nuestro equipo de profesionales.
            </p>
          </div>
        </section>

        {/* Publicaciones Grid */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publicaciones.map((pub) => (
                <article
                  key={pub.id}
                  className="group border border-border hover:border-primary transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <img
                      loading="lazy"
                      decoding="async"
                      src={pub.image || "/placeholder.svg"}
                      alt={pub.titulo}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <span className="inline-block font-sans text-xs text-primary tracking-wider uppercase">
                      {pub.category}
                    </span>
                    <h2 className="font-serif text-2xl text-foreground group-hover:text-primary transition-colors">
                      {pub.titulo}
                    </h2>
                    <p className="font-sans text-foreground/70 leading-relaxed">{pub.descripcion}</p>
                    <div className="flex items-center gap-4 pt-4 border-t border-border text-sm text-foreground/60">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span className="font-sans">{pub.fecha}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        <span className="font-sans">{pub.author}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
