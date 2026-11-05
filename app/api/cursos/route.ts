import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { desc, eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { cursos } from '@/lib/db/schema'

export const revalidate = 60

export async function GET(request: Request) {
  const isAdmin = new URL(request.url).searchParams.get('admin') === '1'
  const rows = isAdmin
    ? await db.select().from(cursos).orderBy(desc(cursos.fecha))
    : await db.select({
        id: cursos.id,
        titulo: cursos.titulo,
        descripcion: cursos.descripcion,
        duracion: cursos.duracion,
        instructor: cursos.instructor,
        schedule: cursos.schedule,
        location: cursos.location,
        capacity: cursos.capacity,
        image: cursos.image,
        fecha: cursos.fecha,
      }).from(cursos).orderBy(desc(cursos.fecha))
  return NextResponse.json(rows, {
    headers: { 'Cache-Control': isAdmin ? 'private, no-store' : 'public, s-maxage=60, stale-while-revalidate=300' },
  })
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const id = crypto.randomUUID()
  const [row] = await db.insert(cursos).values({ id, titulo: body.titulo, descripcion: body.descripcion, contenido: body.contenido, duracion: body.duracion, instructor: body.instructor, schedule: body.schedule, location: body.location, capacity: body.capacity, image: body.image, fecha: new Date() }).returning()
  revalidatePath('/api/cursos')
  return NextResponse.json(row, { status: 201 })
}

export async function PUT(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  const [row] = await db.update(cursos).set({ titulo: body.titulo, descripcion: body.descripcion, contenido: body.contenido, duracion: body.duracion, instructor: body.instructor, schedule: body.schedule, location: body.location, capacity: body.capacity, image: body.image, updatedAt: new Date() }).where(eq(cursos.id, body.id)).returning()
  if (row) revalidatePath('/api/cursos')
  return row ? NextResponse.json(row) : NextResponse.json({ error: 'Not found' }, { status: 404 })
}

export async function DELETE(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await request.json()
  await db.delete(cursos).where(eq(cursos.id, id))
  revalidatePath('/api/cursos')
  return NextResponse.json({ ok: true })
}
