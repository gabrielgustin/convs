'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { LoginDialog } from '@/components/login-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Edit2, LogOut, Upload, X } from 'lucide-react'
import type { Curso } from '@/lib/storage'

export default function CursosAdminPage() {
  const { isAuthenticated, logout } = useAuth()
  const [loginOpen, setLoginOpen] = useState(!isAuthenticated)
  const [cursos, setCursos] = useState<Curso[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    contenido: '',
    duracion: '',
    instructor: 'CONVS',
    schedule: 'Consultar horarios',
    location: 'Modalidad Virtual',
    capacity: '30 participantes',
    image: '',
  })

  useEffect(() => {
    fetch('/api/cursos?admin=1', { cache: 'no-store' }).then((response) => response.ok ? response.json() : []).then(setCursos).catch(() => setCursos([]))
  }, [])

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Debes autenticarte para acceder a esta sección</p>
            <Button onClick={() => setLoginOpen(true)}>Ingresar</Button>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setFormData({ ...formData, image: base64 })
        setImagePreview(base64)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { ...formData, fecha: new Date().toISOString() }
    const response = await fetch('/api/cursos', { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editingId ? { ...payload, id: editingId } : payload) })
    if (response.ok) {
      const savedCurso = await response.json()
      setCursos((current) => editingId ? current.map((curso) => curso.id === editingId ? savedCurso : curso) : [savedCurso, ...current])
      resetForm()
    }
  }

  const handleEdit = (curso: Curso) => {
    setEditingId(curso.id)
    setFormData({
      titulo: curso.titulo,
      descripcion: curso.descripcion,
      contenido: curso.contenido,
      duracion: curso.duracion,
      instructor: curso.instructor || 'CONVS',
      schedule: curso.schedule || 'Consultar horarios',
      location: curso.location || 'Modalidad Virtual',
      capacity: curso.capacity || '30 participantes',
      image: curso.image || '',
    })
    setImagePreview(curso.image || null)
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este curso?')) {
      const response = await fetch('/api/cursos', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
      if (response.ok) setCursos((current) => current.filter((curso) => curso.id !== id))
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      titulo: '',
      descripcion: '',
      contenido: '',
      duracion: '',
      instructor: 'CONVS',
      schedule: 'Consultar horarios',
      location: 'Modalidad Virtual',
      capacity: '30 participantes',
      image: '',
    })
    setImagePreview(null)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="font-serif text-4xl font-light">Panel - Cursos</h1>
            <Button
              onClick={() => logout('/cursos')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut size={18} />
              Salir
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Formulario */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="font-serif text-2xl font-light mb-6">
                {editingId ? 'Editar Curso' : 'Nuevo Curso'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Preview de imagen */}
                {imagePreview && (
                  <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null)
                        setFormData({ ...formData, image: '' })
                      }}
                      className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <X size={18} className="text-white" />
                    </button>
                  </div>
                )}

                {/* Upload de imagen */}
                <div>
                  <label className="block text-sm font-medium mb-2">Imagen</label>
                  <label className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <Upload size={18} />
                    <span className="text-sm">Seleccionar imagen</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Título *</label>
                  <Input
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Título del curso"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Duración *</label>
                    <Input
                      value={formData.duracion}
                      onChange={(e) => setFormData({ ...formData, duracion: e.target.value })}
                      placeholder="Ej: 8 semanas"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Instructor</label>
                    <Input
                      value={formData.instructor}
                      onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                      placeholder="Nombre del instructor"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Descripción *</label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    placeholder="Descripción breve del curso"
                    className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-24"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Modalidad</label>
                    <select
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    >
                      <option>Modalidad Virtual</option>
                      <option>Modalidad Presencial</option>
                      <option>Modalidad Híbrida</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Capacidad</label>
                    <Input
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      placeholder="Ej: 30 participantes"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Horario</label>
                  <Input
                    value={formData.schedule}
                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                    placeholder="Ej: Martes y Jueves, 18:00 - 20:00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Contenido *</label>
                  <textarea
                    value={formData.contenido}
                    onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                    placeholder="Contenido completo del curso"
                    className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-40"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="bg-primary hover:bg-primary/90 flex-1">
                    {editingId ? 'Actualizar' : 'Crear'}
                  </Button>
                  {editingId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </form>
            </div>

            {/* Lista de Cursos */}
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-light mb-4">
                Cursos ({cursos.length})
              </h2>
              <div className="max-h-[800px] overflow-y-auto space-y-3">
                {cursos.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No hay cursos. ¡Crea uno nuevo!
                  </p>
                ) : (
                  cursos.map((curso) => (
                    <div
                      key={curso.id}
                      className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex gap-3 mb-2">
                        {curso.image && (
                          <img
                            src={curso.image}
                            alt={curso.titulo}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-serif text-sm font-medium truncate">{curso.titulo}</h3>
                          <p className="text-xs text-muted-foreground">
                            {curso.location} • {curso.duracion}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {curso.descripcion}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(curso)}
                          className="h-7 w-7 p-0"
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(curso.id)}
                          className="h-7 w-7 p-0 text-destructive"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
