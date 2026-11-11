import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { desc, eq } from 'drizzle-orm'
import { auth, isAdminEmail } from '@/lib/auth'
import { db } from '@/lib/db'
import { publicaciones } from '@/lib/db/schema'

export const revalidate = 60

export async function GET(request: Request) {
  const isAdmin = new URL(request.url).searchParams.get('admin') === '1'
  const rows = isAdmin
    ? await db.select().from(publicaciones).orderBy(desc(publicaciones.fecha))
    : await db.select({
        id: publicaciones.id,
        titulo: publicaciones.titulo,
        descripcion: publicaciones.descripcion,
        category: publicaciones.category,
        author: publicaciones.author,
        image: publicaciones.image,
        fecha: publicaciones.fecha,
      }).from(publicaciones).orderBy(desc(publicaciones.fecha))
  return NextResponse.json(rows, {
    headers: { 'Cache-Control': isAdmin ? 'private, no-store' : 'public, s-maxage=60, stale-while-revalidate=300' },
  })
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!isAdminEmail(session?.user.email)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const [row] = await db.insert(publicaciones).values({ id: crypto.randomUUID(), titulo: body.titulo, descripcion: body.descripcion, contenido: body.contenido, category: body.category, author: body.author, image: body.image, fecha: new Date() }).returning()
  revalidatePath('/api/publicaciones')
  return NextResponse.json(row, { status: 201 })
}

export async function PUT(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!isAdminEmail(session?.user.email)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  const [row] = await db.update(publicaciones).set({ titulo: body.titulo, descripcion: body.descripcion, contenido: body.contenido, category: body.category, author: body.author, image: body.image, updatedAt: new Date() }).where(eq(publicaciones.id, body.id)).returning()
  if (row) revalidatePath('/api/publicaciones')
  return row ? NextResponse.json(row) : NextResponse.json({ error: 'Not found' }, { status: 404 })
}

export async function DELETE(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!isAdminEmail(session?.user.email)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await request.json()
  await db.delete(publicaciones).where(eq(publicaciones.id, id))
  revalidatePath('/api/publicaciones')
  return NextResponse.json({ ok: true })
}
