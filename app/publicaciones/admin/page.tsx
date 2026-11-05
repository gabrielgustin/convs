'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { LoginDialog } from '@/components/login-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Edit2, LogOut, Upload, X } from 'lucide-react'
import type { Publicacion } from '@/lib/storage'

export default function PublicacionesAdminPage() {
  const { isAuthenticated, logout } = useAuth()
  const [loginOpen, setLoginOpen] = useState(!isAuthenticated)
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    contenido: '',
    category: 'Derecho Civil',
    author: 'CONVS',
    image: '',
  })

  useEffect(() => {
    fetch('/api/publicaciones?admin=1', { cache: 'no-store' }).then((response) => response.ok ? response.json() : []).then(setPublicaciones).catch(() => setPublicaciones([]))
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
    const response = await fetch('/api/publicaciones', { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editingId ? { ...payload, id: editingId } : payload) })
    if (response.ok) {
      const savedPublicacion = await response.json()
      setPublicaciones((current) => editingId ? current.map((publicacion) => publicacion.id === editingId ? savedPublicacion : publicacion) : [savedPublicacion, ...current])
      resetForm()
    }
  }

  const handleEdit = (pub: Publicacion) => {
    setEditingId(pub.id)
    setFormData({
      titulo: pub.titulo,
      descripcion: pub.descripcion,
      contenido: pub.contenido,
      category: pub.category || 'Derecho Civil',
      author: pub.author || 'CONVS',
      image: pub.image || '',
    })
    setImagePreview(pub.image || null)
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
      const response = await fetch('/api/publicaciones', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
      if (response.ok) setPublicaciones((current) => current.filter((publicacion) => publicacion.id !== id))
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      titulo: '',
      descripcion: '',
      contenido: '',
      category: 'Derecho Civil',
      author: 'CONVS',
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
            <h1 className="font-serif text-4xl font-light">Panel - Publicaciones</h1>
            <Button
              onClick={() => logout('/publicaciones')}
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
                {editingId ? 'Editar Publicación' : 'Nueva Publicación'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Preview de imagen */}
                {imagePreview && (
                  <div className="relative w-full aspect-[3/2] rounded-lg overflow-hidden bg-muted">
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
                    placeholder="Título de la publicación"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Categoría</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option>Derecho Civil</option>
                      <option>Derecho Laboral</option>
                      <option>Derecho de Familia</option>
                      <option>Derecho Comercial</option>
                      <option>Derecho Inmobiliario</option>
                      <option>Derecho Sucesorio</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Autor</label>
                    <Input
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="Nombre del autor"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Descripción *</label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    placeholder="Descripción breve (que se muestre en el listado)"
                    className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-24"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Contenido *</label>
                  <textarea
                    value={formData.contenido}
                    onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                    placeholder="Contenido completo de la publicación"
                    className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-40"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="bg-primary hover:bg-primary/90 flex-1">
                    {editingId ? 'Actualizar' : 'Publicar'}
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

            {/* Lista de Publicaciones */}
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-light mb-4">
                Publicaciones ({publicaciones.length})
              </h2>
              <div className="max-h-[800px] overflow-y-auto space-y-3">
                {publicaciones.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No hay publicaciones. ¡Crea una nueva!
                  </p>
                ) : (
                  publicaciones.map((pub) => (
                    <div
                      key={pub.id}
                      className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex gap-3 mb-2">
                        {pub.image && (
                          <img
                            src={pub.image}
                            alt={pub.titulo}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-serif text-sm font-medium truncate">{pub.titulo}</h3>
                          <p className="text-xs text-muted-foreground">
                            {pub.category} • {pub.fecha}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {pub.descripcion}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(pub)}
                          className="h-7 w-7 p-0"
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(pub.id)}
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
