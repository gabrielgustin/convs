import { Card } from "@/components/ui/card"
import { Scale, FileText, Users, Briefcase, Building, Shield, Heart } from "lucide-react"

const specialties = [
  {
    icon: Shield,
    title: "Derecho de la Seguridad Social",
    description: "Jubilaciones, pensiones, retiros por invalidez, reajustes de haberes.",
  },
  {
    icon: FileText,
    title: "Derecho Civil",
    description: "Conflictos civiles patrimoniales, daños y perjuicios, contratos, procesos sucesorios, declaratorias de herederos y juicios ejecutivos.",
  },
  {
    icon: Briefcase,
    title: "Derecho Comercial",
    description: "Constitución y organización de sociedades, contratos comerciales, concursos y quiebras.",
  },
  {
    icon: Scale,
    title: "Derecho del Consumidor",
    description: "Defensa frente a prácticas abusivas, estafas bancarias, conflictos con tarjetas de crédito, planes de ahorro y vivienda.",
  },
  {
    icon: Users,
    title: "Derecho de Familia",
    description: "Cuota alimentaria, ejecuciones, filiaciones, divorcios y conflictos familiares, con especial atención al interés superior del niño.",
  },
  {
    icon: Building,
    title: "Derecho Laboral y Accidentes de Trabajo",
    description: "Asesoramiento integral en derecho del trabajo, accidentes laborales y enfermedades profesionales, despidos y derecho colectivo.",
  },
  {
    icon: Heart,
    title: "Derecho de la Salud",
    description: "Conflictos con obras sociales y prepagas, coberturas médicas, acciones de amparo en salud y tutela de derechos de personas con discapacidad.",
  },
]

export function Specialties() {
  return (
    <section id="especialidades" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4 max-w-3xl mx-auto">
          <h2 className="font-serif text-5xl md:text-6xl font-light text-foreground">Áreas de Práctica</h2>
          <div className="w-24 h-px bg-primary mx-auto" />
          <p className="text-lg text-muted-foreground leading-relaxed">
            La vasta experiencia de nuestro estudio nos permite{" "}
            <strong className="text-foreground font-medium">asesorarte calificadamente</strong>{" "}
            en todas nuestras áreas de especialización.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {specialties.map((specialty, index) => {
            const Icon = specialty.icon
            return (
              <Card
                key={index}
                className="group p-8 hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/50 hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-7 h-7 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-2xl font-medium text-foreground">{specialty.title}</h3>
                  <p className="text-muted-foreground leading-relaxed font-light">{specialty.description}</p>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
