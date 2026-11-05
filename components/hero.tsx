import { Button } from "@/components/ui/button"
import Image from "next/image"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-secondary text-secondary-foreground overflow-hidden">
      {/* Imagen de fondo del equipo con blur sutil */}
      <div 
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: "url('/team-office-background.jpg')",
          backgroundPosition: "50% center",
          backgroundSize: "cover",
          filter: "brightness(0.65) blur(3px)",
        }}
      />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Logo CONVS centrado y prominente */}
          <div className="flex flex-col justify-center items-center mb-4">
            <Image
              src="/logo-convs.png"
              alt="CONVS Abogados Asociados"
              width={500}
              height={200}
              className="h-32 md:h-40 w-auto"
              priority
            />
          </div>

          {/* Mensaje principal */}
          <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed text-secondary-foreground/90 font-light">
            Te brindamos asesoramiento legal integral, estratégico y personalizado, priorizando la prevención del conflicto, la claridad en la información y la defensa efectiva de tus derechos.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-sans text-base tracking-wide"
            >
              Conocé Nuestros Servicios
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary/30 text-secondary-foreground hover:bg-primary/10 font-sans text-base tracking-wide bg-transparent"
            >
              Escribinos
            </Button>
          </div>

          {/* Scroll indicator */}
          <div className="pt-16 animate-bounce">
            <div className="w-6 h-10 border-2 border-primary/50 rounded-full mx-auto flex items-start justify-center p-2">
              <div className="w-1 h-2 bg-primary/50 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
