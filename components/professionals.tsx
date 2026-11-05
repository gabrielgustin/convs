import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mail, Linkedin } from "lucide-react"

const professionals = [
  {
    name: "Abog. Dayana del Milagro Oggero",
    title: "Derecho Previsional, Seguridad Social y Sucesiones",
    image: "/dayana-oggero.jpg",
    matricula: "M.P. 1-41457 | M.F: T°511 F°299",
    email: "dayana.oggero@example.com",
    linkedin: "https://linkedin.com/in/dayana-oggero",
  },
  {
    name: "Abog. Nicolás Ricardo Sachetto",
    title: "Derecho de los Negocios, Concursal y del Consumidor",
    image: "/nicolas-sachetto.jpg",
    matricula: "M.P. 1-41886",
    email: "nicolas.sachetto@example.com",
    linkedin: "https://linkedin.com/in/nicolas-sachetto",
  },
  {
    name: "Abog. Jimena Cuello Ferreyra",
    title: "Derecho de las Familias y Sucesiones",
    image: "/jimena-cuello.jpg",
    matricula: "M.P. 1-43119",
    email: "jimena.cuello@example.com",
    linkedin: "https://linkedin.com/in/jimena-cuello",
  },
  {
    name: "Abog. Tatiana Neyra Córdoba",
    title: "Derecho Civil, Comercial, Concursal y de la Salud",
    image: "/tatiana-neira.jpg",
    matricula: "M.P. 1-42854 | Mat. Fed T°510 F°479",
    email: "tatiana.neira@example.com",
    linkedin: "https://linkedin.com/in/tatiana-neira",
  },
  {
    name: "Abog. Mario Alejandro Visconti Bogosevich",
    title: "Derecho Laboral, Accidentes de Trabajo y Civil",
    image: "/mario-visconti.jpg",
    matricula: "M.P. 1-37456",
    email: "mario.visconti@example.com",
    linkedin: "https://linkedin.com/in/mario-visconti",
  },
]

export function Professionals() {
  return (
    <section id="profesionales" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-serif text-5xl md:text-6xl font-light text-foreground">Profesionales</h2>
          <div className="w-24 h-px bg-primary mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {professionals.slice(0, 3).map((professional, index) => (
            <Card
              key={index}
              className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                <img
                  src={professional.image || "/placeholder.svg"}
                  alt={professional.name}
                  className="w-full h-full object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-6 space-y-2">
                <h3 className="font-serif text-xl font-medium text-foreground">{professional.name}</h3>
                <p className="text-sm text-primary font-medium">{professional.matricula}</p>
                <p className="text-muted-foreground font-light leading-relaxed text-sm">{professional.title}</p>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Segunda fila - centrada */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto justify-items-center">
          {professionals.slice(3).map((professional, index) => (
            <Card
              key={index + 3}
              className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 w-full max-w-sm"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                <img
                  src={professional.image || "/placeholder.svg"}
                  alt={professional.name}
                  className="w-full h-full object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-6 space-y-2">
                <h3 className="font-serif text-xl font-medium text-foreground">{professional.name}</h3>
                <p className="text-sm text-primary font-medium">{professional.matricula}</p>
                <p className="text-muted-foreground font-light leading-relaxed text-sm">{professional.title}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
