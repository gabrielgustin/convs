// Carga el directorio nacional de juzgados desde un CSV (separado por comas, con encabezado):
//   name,jurisdiction,province,email,phone,identification,address
// Uso: DATABASE_URL=... node scripts/importar-directorio.mjs ruta/al/archivo.csv
// Es idempotente: actualiza los que ya existen (mismo nombre y provincia).
import { readFile } from "node:fs/promises"
import pg from "pg"
import { parseCsv } from "../lib/csv.mjs"

const [file] = process.argv.slice(2)
if (!file || !process.env.DATABASE_URL) {
  console.error("Uso: DATABASE_URL=... node scripts/importar-directorio.mjs archivo.csv")
  process.exit(1)
}

const [header, ...lines] = parseCsv(await readFile(file, "utf8"))
const cols = ["name", "jurisdiction", "province", "email", "phone", "identification", "address"]
const index = cols.map((c) => header.indexOf(c))
if (index[0] === -1) throw new Error("El CSV necesita al menos la columna 'name'.")

const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
await client.connect()
let n = 0
try {
  await client.query("BEGIN")
  for (const line of lines) {
    const values = index.map((i) => (i === -1 ? null : line[i]?.trim() || null))
    if (!values[0]) continue
    await client.query(
      `insert into court_directory (${cols.join(", ")}) values ($1, $2, $3, $4, $5, $6, $7)
       on conflict (name, province) do update set jurisdiction = excluded.jurisdiction, email = excluded.email,
         phone = excluded.phone, identification = excluded.identification, address = excluded.address`,
      values,
    )
    n++
  }
  await client.query("COMMIT")
} catch (error) {
  await client.query("ROLLBACK")
  throw error
} finally {
  await client.end()
}
console.log(`Directorio: ${n} juzgados cargados o actualizados.`)
