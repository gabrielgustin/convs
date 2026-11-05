import { Button } from "@/components/ui/button"

export function About() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="font-serif text-5xl md:text-6xl font-light text-foreground">Dedicación Diaria</h2>
                <div className="w-24 h-px bg-primary" />
              </div>

              <blockquote className="text-lg leading-relaxed text-muted-foreground border-l-2 border-primary pl-6 italic">
                "Creemos en un ejercicio del derecho cercano, accesible y serio, en el que cada cliente comprenda su situación, sus alternativas y las consecuencias de cada decisión."
              </blockquote>

              <div className="space-y-4 pt-4">
                <p className="leading-relaxed text-foreground/90">
                  Somos un estudio jurídico integrado por profesionales con trayectorias y especializaciones diversas, formado a partir de vínculos construidos tanto en el ámbito académico como en el ejercicio cotidiano de la profesión.
                </p>
                <p className="leading-relaxed text-foreground/90">
                  Nuestra misión es brindar asesoramiento legal integral, estratégico y personalizado, priorizando la prevención del conflicto, la claridad en la información y la defensa efectiva de los derechos de nuestros clientes.
                </p>
                <p className="leading-relaxed text-foreground/90">
                  Con aproximadamente 15 años de ejercicio profesional individual y 4 años como equipo consolidado, trabajamos con una fuerte orientación práctica, combinando rigor técnico, actualización permanente y una mirada humana sobre cada caso.
                </p>
              </div>

              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-sans tracking-wide"
              >
                Conocé Más Sobre Nosotros
              </Button>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-[3/4] rounded-sm overflow-hidden">
                    <img
                      src="/elegant-law-office.png"
                      alt="Oficina CONVS"
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                  <div className="aspect-square rounded-sm overflow-hidden">
                    <img
                      src="/law-books-library.png"
                      alt="Biblioteca jurídica"
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-12">
                  <div className="aspect-square rounded-sm overflow-hidden">
                    <img
                      src="/law-office-meeting-room.jpg"
                      alt="Sala de reuniones"
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                  <div className="aspect-[3/4] rounded-sm overflow-hidden">
                    <img
                      src="/elegant-law-office-reception.jpg"
                      alt="Recepción"
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                </div>
              </div>

              {/* Elemento decorativo */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 border border-primary/30 -z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
