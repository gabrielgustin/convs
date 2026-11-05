"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const WHATSAPP_NUMBER = "5493515223799"

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const whatsappMessage = `*Nuevo mensaje desde CONVS*\n\n*Nombre:* ${formData.name}\n*Email:* ${formData.email}\n*Telefono:* ${formData.phone}\n*Mensaje:*\n${formData.message}`
    const encodedMessage = encodeURIComponent(whatsappMessage)
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`
    
    window.open(whatsappUrl, "_blank")
    
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    })
    
    setIsLoading(false)
  }

  return (
    <section id="contacto" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-serif text-5xl md:text-6xl font-light text-foreground">Contactanos</h2>
            <div className="w-24 h-px bg-primary mx-auto" />
            <p className="text-lg text-muted-foreground leading-relaxed">
              Completá el formulario y nos pondremos en contacto a través de WhatsApp para asesorarte sobre tu consulta.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 lg:p-12 rounded-lg border border-border/50">
            <div className="space-y-2">
              <label htmlFor="name" className="font-sans text-sm font-medium text-foreground">
                Nombre y Apellido
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Tu nombre completo"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-background border-border/50 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="font-sans text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-background border-border/50 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="font-sans text-sm font-medium text-foreground">
                Telefono
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+54 9 3515 22-3799"
                value={formData.phone}
                onChange={handleChange}
                required
                className="bg-background border-border/50 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="font-sans text-sm font-medium text-foreground">
                Tu Consulta
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Contanos sobre tu consulta juridica..."
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-background border border-border/50 rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-sans text-sm"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-sans text-base tracking-wide flex items-center justify-center gap-2"
            >
              {isLoading ? "Enviando..." : "Enviar por WhatsApp"}
              {!isLoading && <Send className="w-4 h-4" />}
            </Button>

            <p className="text-xs text-muted-foreground text-center pt-4">
              Seras redirigido a WhatsApp para enviar tu consulta de forma segura.
            </p>
          </form>

          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="font-serif text-xl font-light text-foreground mb-2">Telefono</h3>
              <a href="tel:+5493515223799" className="text-primary hover:text-primary/80 transition-colors">
                +54 9 3515 22-3799
              </a>
            </div>
            <div className="text-center">
              <h3 className="font-serif text-xl font-light text-foreground mb-2">Ubicacion</h3>
              <p className="text-muted-foreground text-sm">
                Calle Sucre 135, Piso 2, Of. 3
                <br />
                Cordoba, Argentina
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-serif text-xl font-light text-foreground mb-2">Email</h3>
              <a href="mailto:contacto@convs.com.ar" className="text-primary hover:text-primary/80 transition-colors">
                contacto@convs.com.ar
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
