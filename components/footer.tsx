import { Scale, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl mx-auto">
          {/* Logo y descripción */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-3">
              <Scale className="w-8 h-8 text-primary" strokeWidth={1.5} />
              <div>
                <h3 className="font-serif text-2xl font-medium">CONVS</h3>
                <p className="text-sm text-primary">Abogados Asociados</p>
              </div>
            </div>
            <p className="text-secondary-foreground/80 leading-relaxed max-w-md">
              Estudio jurídico integrado por profesionales con trayectorias y especializaciones diversas. Brindamos asesoramiento legal integral, estratégico y personalizado.
            </p>
          </div>

          {/* Contacto */}
          <div className="space-y-4">
            <h4 className="font-serif text-xl font-medium">Contacto</h4>
            <div className="space-y-3">
              <a
                href="tel:+543515223799"
                className="flex items-center gap-2 text-secondary-foreground/80 hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm">+54 351 522-3799</span>
              </a>
              <a
                href="mailto:contacto@convs.com.ar"
                className="flex items-center gap-2 text-secondary-foreground/80 hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm">contacto@convs.com.ar</span>
              </a>
              <div className="flex items-start gap-2 text-secondary-foreground/80">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span className="text-sm">
                  Calle Sucre 135, Piso 2, Oficina 3<br />
                  Ciudad de Córdoba
                </span>
              </div>
            </div>
          </div>

          {/* Horarios */}
          <div className="space-y-4">
            <h4 className="font-serif text-xl font-medium">Horarios</h4>
            <div className="space-y-2 text-sm text-secondary-foreground/80">
              <p className="text-secondary-foreground">Lunes a Viernes</p>
              <p className="font-medium text-secondary-foreground">9:00 - 18:00 hs</p>
              <p className="pt-2">Atención con turno previo</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-secondary-foreground/10 mt-12 pt-8 text-center">
          <p className="text-sm text-secondary-foreground/60">
            © {new Date().getFullYear()} CONVS Abogados Asociados. Todos los derechos reservados.
          </p>
          <div className="mt-6 inline-flex items-center gap-3 text-secondary-foreground/60">
            <span className="text-sm">Created by</span>
            <a
              href="https://www.autogestiva.com.ar"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center"
              aria-label="Visitar Autogestiva"
            >
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logofooter-DJsq2VsZ29M69TvduXUxBFF0OQf8AX.png"
                alt="Autogestiva"
                className="h-12 w-auto opacity-80 brightness-0 invert transition-opacity group-hover:opacity-100"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
