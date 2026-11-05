'use client'

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { useState } from "react"

export default function ProfesionalesPage() {
  const [coloredImages, setColoredImages] = useState<Set<number>>(new Set())
  const profesionales = [
    {
      name: "Abog. Dayana del Milagro Oggero",
      title: "M.P. 1-41457",
      specialty: "Derecho Previsional, Seguridad Social y Sucesiones",
      image: "/dayana-oggero.jpg",
      bio: "Abogada egresada de la Universidad Nacional de Córdoba. Cuenta con un Posgrado en Derecho de la Seguridad Social y Laboral, y múltiples formaciones complementarias en Derecho Previsional. Posee amplia experiencia en trámites jubilatorios, pensiones, retiros por invalidez, reajustes de haberes y reclamos administrativos y judiciales ante organismos previsionales.",
    },
    {
      name: "Abog. Nicolás Ricardo Sachetto",
      title: "M.P. 1-41886",
      specialty: "Derecho de los Negocios, Concursal, Cambiario y del Consumidor",
      image: "/nicolas-sachetto.jpg",
      bio: "Abogado egresado de la Universidad Nacional de Córdoba. Especializando en Derecho de los Negocios con orientación al asesoramiento de empresas. Adscripto a las Cátedras de Derecho Concursal y Cambiario, y a la Cátedra de Derecho del Consumidor. Cuenta con sólida experiencia en litigios civiles y comerciales, concursos y quiebras.",
    },
    {
      name: "Abog. Jimena Cuello Ferreyra",
      title: "M.P. 1-43119",
      specialty: "Derecho de las Familias y Sucesiones",
      image: "/jimena-cuello.jpg",
      bio: "Abogada egresada de la Universidad Nacional de Córdoba. Especializada en Derecho de Familia y Sucesiones, con un enfoque profesional que combina sólida experiencia técnica y la empatía necesaria para acompañar a clientes en procesos jurídicos sensibles. Trabaja siempre teniendo en cuenta el interés superior de niños, niñas y adolescentes.",
    },
    {
      name: "Abog. Tatiana Neyra Córdoba",
      title: "M.P. 1-42854 | Mat. Fed. T° 510 F°479",
      specialty: "Derecho Civil y Comercial, Concursal, Societario y de la Salud",
      image: "/tatiana-neira.jpg",
      bio: "Abogada egresada de la Universidad Nacional de Córdoba, con diplomaturas en Derecho Concursal y Derecho de la Salud. Desarrolla su práctica profesional en el ámbito del derecho civil y comercial. Brinda asesoramiento especializado en Derecho de la Salud, con particular énfasis en materia de discapacidad.",
    },
    {
      name: "Abog. Mario Alejandro Visconti Bogosevich",
      title: "M.P. 1-37456 | Mat. Fed. T° 505 F°163",
      specialty: "Derecho Laboral, Accidentes de Trabajo, Derecho Civil e Inmobiliario",
      image: "/mario-visconti.jpg",
      bio: "Abogado y Notario egresado de la Universidad Católica de Córdoba. Especialista en Derecho Laboral y Magíster en Derecho del Trabajo. Cuenta con especialización internacional en 'Los derechos laborales como derechos humanos' del Consejo de Europa. Colaborador activo en la revista jurídica Ut Supra y miembro fundacional de la Red Argentina de Abogacía Comunitaria (RAAC).",
    },
  ]

  const toggleImageColor = (index: number) => {
    const newColored = new Set(coloredImages)
    if (newColored.has(index)) {
      newColored.delete(index)
    } else {
      newColored.add(index)
    }
    setColoredImages(newColored)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="pt-28 lg:pt-36 pb-16 lg:pb-24 bg-secondary">
          <div className="container mx-auto px-4 lg:px-8">
            <h1 className="font-serif text-4xl lg:text-6xl text-secondary-foreground text-center mb-6">
              Nuestro Equipo
            </h1>
            <p className="font-sans text-lg text-secondary-foreground/80 text-center max-w-3xl mx-auto leading-relaxed">
              Un equipo de profesionales con trayectorias y especializaciones diversas, formado a partir de vínculos construidos en el ámbito académico y en el ejercicio cotidiano de la profesión.
            </p>
          </div>
        </section>

        {/* Profesionales List */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 gap-16">
              {profesionales.map((profesional, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${
                    index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  } gap-8 lg:gap-12 items-center`}
                >
                  {/* Image */}
                  <div className="w-full lg:w-1/2">
                    <div 
                      className="relative aspect-[4/5] overflow-hidden cursor-pointer lg:cursor-default"
                      onClick={() => toggleImageColor(index)}
                      title="Toca para cambiar a color"
                    >
                      <Image
                        src={profesional.image || "/placeholder.svg"}
                        alt={profesional.name}
                        fill
                        className={`object-cover transition-all duration-500 ${
                          coloredImages.has(index)
                            ? "grayscale-0"
                            : "grayscale hover:grayscale-0"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="w-full lg:w-1/2 space-y-4">
                    <div>
                      <h2 className="font-serif text-3xl lg:text-4xl text-foreground mb-2">{profesional.name}</h2>
                      <p className="font-sans text-primary text-lg tracking-wider">{profesional.title}</p>
                    </div>
                    <p className="font-sans text-sm text-foreground/60 tracking-wider uppercase">
                      {profesional.specialty}
                    </p>
                    <p className="font-sans text-foreground/70 text-lg leading-relaxed">{profesional.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-muted">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h2 className="font-serif text-3xl lg:text-5xl text-foreground mb-6">Conozca a nuestro equipo</h2>
            <p className="font-sans text-lg text-foreground/70 mb-8 max-w-2xl mx-auto leading-relaxed">
              Agende una consulta y permítanos acompañarlo en sus necesidades legales.
            </p>
            <a
              href="#contacto"
              className="inline-block px-8 py-4 bg-primary text-primary-foreground font-sans tracking-wider hover:bg-primary/90 transition-colors"
            >
              AGENDAR CONSULTA
            </a>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}
