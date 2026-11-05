// Límites por plan. Los precios y planes pagos se definen con el cliente.
export const PLANS = {
  gratis: { label: "Gratis", expedientes: 100, storageMb: 2048, courtFilesMb: 20480, users: 3 },
  estudio: { label: "Estudio", expedientes: 2000, storageMb: 51200, courtFilesMb: 204800, users: 25 },
} as const
export type PlanId = keyof typeof PLANS
export const planOf = (id: string) => PLANS[(id in PLANS ? id : "gratis") as PlanId]
