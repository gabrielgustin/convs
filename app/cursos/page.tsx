'use client'

import { useState, useEffect } from 'react'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Clock, MapPin, Calendar, Users } from "lucide-react"
import type { Curso } from "@/lib/storage"

interface CursoDisplay extends Curso {
  instructor?: string
  duration?: string
  schedule?: string
  location?: string
  capacity?: string
  startDate?: string
  image?: string
}

export default function CursosPage() {
  const [cursos, setCursos] = useState<CursoDisplay[]>([])
  const [contactForm, setContactForm] = useState({
    nombre: '',
    email: '',
    telefonoId: '',
    cursoId: '',
    consulta: '',
  })

  useEffect(() => {
    fetch('/api/cursos')
      .then((response) => response.ok ? response.json() : [])
      .then((stored: CursoDisplay[]) => setCursos(stored.length ? stored : defaultCursos))
      .catch(() => setCursos(defaultCursos))
  }, [])

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Consulta sobre curso enviada:', contactForm)
    // Aquí iría la lógica para enviar el formulario
    setContactForm({
      nombre: '',
      email: '',
      telefonoId: '',
      cursoId: '',
      consulta: '',
    })
  }

  const defaultCursos: CursoDisplay[] = [
    {
      id: "1",
      titulo: "Introducción al Derecho Civil",
      descripcion: "Curso intensivo que aborda los conceptos fundamentales del derecho civil argentino.",
      contenido: "Curso intensivo que aborda los conceptos fundamentales del derecho civil argentino, desde las personas y la familia hasta los contratos y las obligaciones.",
      duracion: "8 semanas",
      fecha: "15 de Febrero, 2025",
      instructor: "Dr. Juan Carlos Martínez",
      duration: "8 semanas",
      schedule: "Martes y Jueves, 18:00 - 20:00",
      location: "Modalidad Virtual",
      capacity: "30 participantes",
      startDate: "15 de Febrero, 2025",
      image: "/law-classroom-civil-code-books.jpg",
    },
    {
      id: "2",
      titulo: "Derecho Laboral en la Práctica",
      descripcion: "Abordaje práctico de las principales cuestiones laborales.",
      contenido: "Abordaje práctico de las principales cuestiones laborales, incluyendo despidos, accidentes de trabajo, y negociaciones colectivas con casos reales.",
      duracion: "6 semanas",
      fecha: "1 de Marzo, 2025",
      instructor: "Dr. Roberto Silva",
      duration: "6 semanas",
      schedule: "Miércoles, 19:00 - 21:00",
      location: "Modalidad Híbrida",
      capacity: "25 participantes",
      startDate: "1 de Marzo, 2025",
      image: "/labor-law-workplace-training.jpg",
    },
    {
      id: "3",
      titulo: "Mediación Familiar",
      descripcion: "Formación especializada en técnicas de mediación familiar.",
      contenido: "Formación especializada en técnicas de mediación familiar, orientada a profesionales que buscan herramientas para la resolución pacífica de conflictos.",
      duracion: "10 semanas",
      fecha: "10 de Marzo, 2025",
      instructor: "Dra. María Fernanda López",
      duration: "10 semanas",
      schedule: "Lunes, 17:00 - 19:00",
      location: "Modalidad Presencial",
      capacity: "20 participantes",
      startDate: "10 de Marzo, 2025",
      image: "/family-mediation-counseling.jpg",
    },
    {
      id: "4",
      titulo: "Contratos Inmobiliarios",
      descripcion: "Taller intensivo sobre redacción y análisis de contratos inmobiliarios.",
      contenido: "Taller intensivo sobre redacción y análisis de contratos inmobiliarios, desde boletos de compraventa hasta contratos de alquiler y leasing.",
      duracion: "4 semanas",
      fecha: "20 de Febrero, 2025",
      instructor: "Dra. Ana Sofía Romero",
      duration: "4 semanas",
      schedule: "Viernes, 18:30 - 20:30",
      location: "Modalidad Virtual",
      capacity: "35 participantes",
      startDate: "20 de Febrero, 2025",
      image: "/real-estate-contracts-documents.jpg",
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
              Cursos y Capacitaciones
            </h1>
            <p className="font-sans text-lg text-secondary-foreground/80 text-center max-w-3xl mx-auto leading-relaxed">
              Programas de formación dictados por nuestros profesionales, diseñados para abogados, estudiantes y público en general interesado en temas legales.
            </p>
          </div>
        </section>

        {/* Cursos List */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 gap-12">
              {cursos.map((curso) => (
                <div
                  key={curso.id}
                  className="flex flex-col lg:flex-row gap-8 border border-border hover:border-primary transition-all duration-300 overflow-hidden"
                >
                  {/* Image */}
                  <div className="lg:w-2/5">
                    <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full overflow-hidden">
                      <img
                        src={curso.image || "/placeholder.svg"}
                        alt={curso.titulo}
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="lg:w-3/5 p-8 space-y-6">
                    <div>
                      <h2 className="font-serif text-3xl lg:text-4xl text-foreground mb-2">{curso.titulo}</h2>
                      <p className="font-sans text-primary tracking-wider">{curso.instructor}</p>
                    </div>

                    <p className="font-sans text-foreground/70 leading-relaxed">{curso.descripcion}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                      <div className="flex items-center gap-3 text-foreground/60">
                        <Clock size={20} className="text-primary" />
                        <span className="font-sans text-sm">{curso.duration}</span>
                      </div>
                      <div className="flex items-center gap-3 text-foreground/60">
                        <Calendar size={20} className="text-primary" />
                        <span className="font-sans text-sm">{curso.schedule}</span>
                      </div>
                      <div className="flex items-center gap-3 text-foreground/60">
                        <MapPin size={20} className="text-primary" />
                        <span className="font-sans text-sm">{curso.location}</span>
                      </div>
                      <div className="flex items-center gap-3 text-foreground/60">
                        <Users size={20} className="text-primary" />
                        <span className="font-sans text-sm">{curso.capacity}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="font-sans text-sm text-foreground/60">Inicio: {curso.startDate}</span>
                      <button className="px-6 py-2 bg-primary text-primary-foreground font-sans text-sm tracking-wider hover:bg-primary/90 transition-colors">
                        INSCRIBIRSE
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-serif text-3xl lg:text-5xl text-foreground text-center mb-4">
                Asesoría Sobre Cursos
              </h2>
              <p className="font-sans text-lg text-foreground/70 text-center mb-12 leading-relaxed">
                ¿Tiene dudas sobre alguno de nuestros cursos? Complete el formulario y nos pondremos en contacto para asesorarlo.
              </p>

              <div className="bg-card border border-border rounded-lg p-8 lg:p-12">
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nombre */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        value={contactForm.nombre}
                        onChange={(e) => setContactForm({ ...contactForm, nombre: e.target.value })}
                        placeholder="Su nombre"
                        required
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="su.email@ejemplo.com"
                        required
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>

                    {/* Teléfono */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Teléfono (Opcional)
                      </label>
                      <input
                        type="tel"
                        value={contactForm.telefonoId}
                        onChange={(e) => setContactForm({ ...contactForm, telefonoId: e.target.value })}
                        placeholder="+54 9 351 XXX-XXXX"
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>

                    {/* Seleccionar Curso */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Curso de Interés *
                      </label>
                      <select
                        value={contactForm.cursoId}
                        onChange={(e) => setContactForm({ ...contactForm, cursoId: e.target.value })}
                        required
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      >
                        <option value="">Seleccione un curso</option>
                        {cursos.map((curso) => (
                          <option key={curso.id} value={curso.id}>
                            {curso.titulo}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Consulta */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Su Consulta *
                    </label>
                    <textarea
                      value={contactForm.consulta}
                      onChange={(e) => setContactForm({ ...contactForm, consulta: e.target.value })}
                      placeholder="Escriba su pregunta o consulta aquí..."
                      required
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all min-h-32"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-8 py-3 bg-primary text-primary-foreground font-sans font-medium tracking-wider hover:bg-primary/90 transition-colors rounded-lg"
                  >
                    Enviar Consulta
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-muted">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h2 className="font-serif text-3xl lg:text-5xl text-foreground mb-6">
              ¿Necesita capacitación personalizada?
            </h2>
            <p className="font-sans text-lg text-foreground/70 mb-8 max-w-2xl mx-auto leading-relaxed">
              Ofrecemos cursos in-company adaptados a las necesidades específicas de su empresa u organización.
            </p>
            <a
              href="/#contacto"
              className="inline-block px-8 py-4 bg-primary text-primary-foreground font-sans tracking-wider hover:bg-primary/90 transition-colors"
            >
              CONSULTAR
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
