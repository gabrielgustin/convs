export interface Publicacion {
  id: string
  titulo: string
  descripcion: string
  contenido: string
  fecha: string
  image?: string
  category?: string
  author?: string
}

export interface Curso {
  id: string
  titulo: string
  descripcion: string
  contenido: string
  duracion: string
  fecha: string
  image?: string
  instructor?: string
  duration?: string
  schedule?: string
  location?: string
  capacity?: string
  startDate?: string
}

const PUBLICACIONES_KEY = 'convs_publicaciones'
const CURSOS_KEY = 'convs_cursos'

export function getPublicaciones(): Publicacion[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(PUBLICACIONES_KEY)
  return stored ? JSON.parse(stored) : []
}

export function savePublicaciones(publicaciones: Publicacion[]) {
  localStorage.setItem(PUBLICACIONES_KEY, JSON.stringify(publicaciones))
}

export function getCursos(): Curso[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(CURSOS_KEY)
  return stored ? JSON.parse(stored) : []
}

export function saveCursos(cursos: Curso[]) {
  localStorage.setItem(CURSOS_KEY, JSON.stringify(cursos))
}

export function addPublicacion(publicacion: Omit<Publicacion, 'id'>) {
  const publicaciones = getPublicaciones()
  const newPublicacion: Publicacion = {
    ...publicacion,
    id: Date.now().toString(),
  }
  publicaciones.unshift(newPublicacion)
  savePublicaciones(publicaciones)
  return newPublicacion
}

export function updatePublicacion(id: string, publicacion: Omit<Publicacion, 'id'>) {
  const publicaciones = getPublicaciones()
  const index = publicaciones.findIndex((p) => p.id === id)
  if (index !== -1) {
    publicaciones[index] = { id, ...publicacion }
    savePublicaciones(publicaciones)
  }
}

export function deletePublicacion(id: string) {
  const publicaciones = getPublicaciones()
  savePublicaciones(publicaciones.filter((p) => p.id !== id))
}

export function addCurso(curso: Omit<Curso, 'id'>) {
  const cursos = getCursos()
  const newCurso: Curso = {
    ...curso,
    id: Date.now().toString(),
  }
  cursos.unshift(newCurso)
  saveCursos(cursos)
  return newCurso
}

export function updateCurso(id: string, curso: Omit<Curso, 'id'>) {
  const cursos = getCursos()
  const index = cursos.findIndex((c) => c.id === id)
  if (index !== -1) {
    cursos[index] = { id, ...curso }
    saveCursos(cursos)
  }
}

export function deleteCurso(id: string) {
  const cursos = getCursos()
  saveCursos(cursos.filter((c) => c.id !== id))
}
