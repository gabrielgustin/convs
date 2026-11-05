// Clientes y juzgados comparten forma: una ficha con tipo, estado, asignados, etiquetas y datos de contacto.

export type ContactEntity = "client" | "court"
export type Field = { key: string; label: string; type?: "email" | "tel" | "textarea" }

export const CONTACTS = {
  client: {
    table: "clients",
    path: "/clientes",
    singular: "cliente",
    plural: "Clientes",
    typeKind: "tipo_cliente",
    fields: [
      { key: "email", label: "Email", type: "email" },
      { key: "phone", label: "Teléfono", type: "tel" },
      { key: "tax_id", label: "CUIT / DNI" },
      { key: "address", label: "Dirección" },
      { key: "notes", label: "Observaciones", type: "textarea" },
    ] as Field[],
    columns: ["email", "phone"],
    // Expedientes vinculados (sin contar los de la papelera).
    mattersCount: `(select count(*) from matter_clients mc join matters m on m.id = mc.matter_id where mc.client_id = x.id and m.deleted_at is null)`,
  },
  court: {
    table: "courts",
    path: "/juzgados",
    singular: "juzgado",
    plural: "Juzgados",
    typeKind: "tipo_juzgado",
    fields: [
      { key: "province", label: "Provincia" },
      { key: "email", label: "Email", type: "email" },
      { key: "phone", label: "Teléfono", type: "tel" },
      { key: "identification", label: "Identificación" },
      { key: "address", label: "Dirección" },
      { key: "notes", label: "Observaciones", type: "textarea" },
    ] as Field[],
    columns: ["province", "email", "phone", "identification", "address"],
    mattersCount: `(select count(*) from matters m where m.court_id = x.id and m.deleted_at is null)`,
  },
} as const

export const PROVINCES = [
  "Buenos Aires", "CABA", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes", "Entre Ríos", "Formosa", "Jujuy",
  "La Pampa", "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis", "Santa Cruz",
  "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán",
]
