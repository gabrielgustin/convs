import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Scale, Users, Building2, FileText, Briefcase, Shield, Heart } from "lucide-react"

export default function EspecialidadesPage() {
  const especialidades = [
    {
      icon: Shield,
      title: "Derecho de la Seguridad Social",
      description:
        "Prestamos asesoramiento integral en materia previsional, incluyendo jubilaciones, pensiones, retiros por invalidez y reajustes de haberes. Acompañamos tanto en la instancia administrativa como judicial.",
    },
    {
      icon: FileText,
      title: "Derecho Civil",
      description:
        "Intervenimos en conflictos civiles patrimoniales, reclamos por daños y perjuicios, redacción, modificación y ejecución de contratos, así como en procesos sucesorios, declaratorias de herederos y juicios ejecutivos, ofreciendo soluciones eficaces y adaptadas a las particularidades de cada caso.",
    },
    {
      icon: Briefcase,
      title: "Derecho Comercial",
      description:
        "Asesoramos integralmente a deudores y acreedores en procesos de concursos preventivos y quiebras. Acompañamos a empresas y comerciantes en la constitución, formalización y reorganización de sociedades, así como en la redacción, revisión y análisis de contratos civiles y comerciales.",
    },
    {
      icon: Scale,
      title: "Derecho del Consumidor",
      description:
        "Defendemos los derechos de consumidores y usuarios frente a prácticas abusivas, estafas bancarias, conflictos con tarjetas de crédito, planes de ahorro y vivienda, y relaciones de consumo en general, priorizando la reparación integral del daño.",
    },
    {
      icon: Users,
      title: "Derecho de Familia",
      description:
        "Brindamos asistencia legal en procesos de cuota alimentaria, ejecuciones, filiaciones, divorcios y demás conflictos familiares, con especial atención al interés superior del niño y la resolución responsable del conflicto.",
    },
    {
      icon: Building2,
      title: "Derecho Laboral, Accidentes de Trabajo y Enfermedades Profesionales",
      description:
        "Brindamos asesoramiento jurídico integral en todas las dimensiones del Derecho del Trabajo, garantizando la protección efectiva de la salud e integridad del trabajador frente a las ART y en el ámbito judicial, abordando el derecho individual y colectivo con un enfoque humano y empático.",
    },
    {
      icon: Heart,
      title: "Derecho de la Salud",
      description:
        "Intervenimos brindando asesoramiento integral a familias, profesionales y prestadores de servicios de salud frente a conflictos con obras sociales y empresas de medicina prepaga, incluyendo acciones de amparo en materia de salud y tutela efectiva del derecho a la salud.",
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
              Especialidades
            </h1>
            <p className="font-sans text-lg text-secondary-foreground/80 text-center max-w-3xl mx-auto leading-relaxed">
              Ofrecemos un servicio jurídico integral en diversas áreas del derecho, brindando soluciones personalizadas
              y efectivas para cada caso.
            </p>
          </div>
        </section>

        {/* Especialidades Grid */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {especialidades.map((especialidad, index) => {
                const Icon = especialidad.icon
                return (
                  <div
                    key={index}
                    className="group p-8 border border-border hover:border-primary transition-all duration-300"
                  >
                    <Icon className="w-12 h-12 text-primary mb-6 group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="font-serif text-2xl text-foreground mb-4">{especialidad.title}</h3>
                    <p className="font-sans text-foreground/70 leading-relaxed">{especialidad.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-muted">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h2 className="font-serif text-3xl lg:text-5xl text-foreground mb-6">¿Necesita asesoramiento legal?</h2>
            <p className="font-sans text-lg text-foreground/70 mb-8 max-w-2xl mx-auto leading-relaxed">
              Nuestro equipo está listo para analizar su caso y brindarle la mejor solución jurídica.
            </p>
            <a
              href="#contacto"
              className="inline-block px-8 py-4 bg-primary text-primary-foreground font-sans tracking-wider hover:bg-primary/90 transition-colors"
            >
              CONTACTAR
            </a>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}
