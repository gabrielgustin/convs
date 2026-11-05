import { describe, expect, it } from "vitest"
import { parseCsv } from "@/lib/csv.mjs"

describe("parseCsv", () => {
  it("respeta comillas, comas internas y CRLF", () => {
    const text = 'name,province\r\n"Juzgado Civil N° 1, Sec. 2",CABA\r\n"Dice ""hola""",Salta\n\n'
    expect(parseCsv(text)).toEqual([["name", "province"], ["Juzgado Civil N° 1, Sec. 2", "CABA"], ['Dice "hola"', "Salta"]])
  })
})
