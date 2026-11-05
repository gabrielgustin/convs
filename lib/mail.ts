import "server-only"

/**
 * Manda un email transaccional con Resend (RESEND_API_KEY + MAIL_FROM).
 * Sin clave, en desarrollo lo imprime en la consola del servidor para poder seguir el link.
 */
export async function sendMail(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    if (process.env.NODE_ENV === "production") throw new Error("Falta RESEND_API_KEY para enviar emails.")
    console.log(`\n[mail] Para: ${to}\n[mail] Asunto: ${subject}\n[mail] ${html.replace(/<[^>]+>/g, " ")}\n`)
    return
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.MAIL_FROM ?? "Estudio <no-reply@example.com>", to, subject, html }),
  })
  if (!response.ok) throw new Error(`No se pudo enviar el email (${response.status}): ${await response.text()}`)
}

export const linkMail = (intro: string, url: string, cta: string) =>
  `<p>${intro}</p><p><a href="${url}">${cta}</a></p><p>Si no lo pediste, ignorá este mensaje.</p>`
