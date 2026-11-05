import { describe, expect, it } from "vitest"
import { decideJoin, emailDomain } from "@/lib/onboarding"

describe("decideJoin", () => {
  const domains = [
    { studio_id: "s-dom", domain: "estudio.com.ar", verified_at: new Date() },
    { studio_id: "s-pend", domain: "pendiente.com", verified_at: null },
  ]

  it("prefiere la invitación al dominio", () => {
    expect(decideJoin("ana@estudio.com.ar", [{ studio_id: "s-inv", role: "asistente" }], domains)).toEqual({
      action: "join", studioId: "s-inv", role: "asistente", via: "invitation",
    })
  })

  it("entra por dominio verificado como abogado", () => {
    expect(decideJoin("Ana@Estudio.com.ar", [], domains)).toMatchObject({ action: "join", studioId: "s-dom", role: "abogado" })
  })

  it("ignora dominios sin verificar y crea su estudio", () => {
    expect(decideJoin("ana@pendiente.com", [], domains)).toEqual({ action: "create" })
  })

  it("extrae el dominio en minúsculas", () => {
    expect(emailDomain(" X@Foo.COM ")).toBe("foo.com")
  })
})
