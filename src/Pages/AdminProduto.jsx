// src/Pages/AdminProduto.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Trash2, Upload, X } from 'lucide-react'
import { supabase } from '../services/supabase'
import { toast } from 'sonner'
import '../styles/AdminProduto.css'

function AdminProduto() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditando = id !== 'novo'
  
  const [loading, setLoading] = useState(false)
  const [carregandoProduto, setCarregandoProduto] = useState(isEditando)
  const [uploadando, setUploadando] = useState(false)
  const [imagemPreview, setImagemPreview] = useState(null)

  const [formData, setFormData] = useState({
    nome: '',
    slug: '',
    categoria: 'Decoração',
    preco: '',
    preco_original: '',
    em_promocao: false,
    descricao: '',
    imagem: '',
    estoque: '',
    rating: 5.0,
    num_avaliacoes: 0
  })

  const categorias = ['Decoração', 'Chaveiros', 'Bolsas', 'Vestuário']

  useEffect(() => {
    if (isEditando && id) {
      carregarProduto()
    }
  }, [id])

  const carregarProduto = async () => {
    setCarregandoProduto(true)
    
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      toast.error('Erro ao carregar produto')
      navigate('/admin')
    } else if (data) {
      setFormData({
        nome: data.nome || '',
        slug: data.slug || '',
        categoria: data.categoria || 'Decoração',
        preco: data.preco || '',
        preco_original: data.preco_original || '',
        em_promocao: data.em_promocao || false,
        descricao: data.descricao || '',
        imagem: data.imagem || '',
        estoque: data.estoque || '',
        rating: data.rating || 5.0,
        num_avaliacoes: data.num_avaliacoes || 0
      })
      if (data.imagem && data.imagem.startsWith('http')) {
        setImagemPreview(data.imagem)
      }
    }
    setCarregandoProduto(false)
  }

  const gerarSlug = (nome) => {
    return nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    if (name === 'nome') {
      setFormData(prev => ({
        ...prev,
        slug: gerarSlug(value)
      }))
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Selecione uma imagem válida')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 2MB')
      return
    }

    setUploadando(true)

    try {
      const previewUrl = URL.createObjectURL(file)
      setImagemPreview(previewUrl)

      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `produtos/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('produtos-imagens')
        .upload(filePath, file)

      if (uploadError) {
        toast.error('Erro ao fazer upload')
        setImagemPreview(null)
        setUploadando(false)
        return
      }

      const { data: publicUrlData } = supabase.storage
        .from('produtos-imagens')
        .getPublicUrl(filePath)

      setFormData(prev => ({ ...prev, imagem: publicUrlData.publicUrl }))
      toast.success('Imagem enviada!')

    } catch (error) {
      console.error(error)
      toast.error('Erro ao processar imagem')
    } finally {
      setUploadando(false)
    }
  }

  const removerImagem = () => {
    setImagemPreview(null)
    setFormData(prev => ({ ...prev, imagem: '' }))
    toast.info('Imagem removida')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!formData.nome.trim()) {
      toast.error('Nome é obrigatório')
      setLoading(false)
      return
    }
    if (!formData.preco || formData.preco <= 0) {
      toast.error('Preço válido é obrigatório')
      setLoading(false)
      return
    }

    const produtoData = {
      nome: formData.nome,
      slug: formData.slug || gerarSlug(formData.nome),
      categoria: formData.categoria,
      preco: parseFloat(formData.preco),
      preco_original: formData.preco_original ? parseFloat(formData.preco_original) : null,
      em_promocao: formData.em_promocao,
      descricao: formData.descricao,
      imagem: formData.imagem || '🧶',
      estoque: parseInt(formData.estoque) || 0,
      rating: formData.rating || 5.0,
      num_avaliacoes: formData.num_avaliacoes || 0
    }

    let result
    if (isEditando) {
      result = await supabase.from('produtos').update(produtoData).eq('id', id)
      if (!result.error) toast.success('Produto atualizado!')
      else toast.error(`Erro: ${result.error.message}`)
    } else {
      result = await supabase.from('produtos').insert([produtoData])
      if (!result.error) toast.success('Produto criado!')
      else toast.error(`Erro: ${result.error.message}`)
    }

    if (!result.error) navigate('/admin')
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!window.confirm('Excluir permanentemente?')) return
    setLoading(true)
    const { error } = await supabase.from('produtos').delete().eq('id', id)
    if (error) toast.error(`Erro: ${error.message}`)
    else toast.success('Produto excluído!')
    if (!error) navigate('/admin')
    setLoading(false)
  }

  if (carregandoProduto) {
    return (
      <div className="admin-produto-loading">
        <div className="spinner"></div>
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <div className="admin-produto-page">
      <div className="admin-produto-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <button className="back-btn" onClick={() => navigate('/admin')}>
            <ArrowLeft size={18} /> Voltar
          </button>

          <h1 className="form-title">{isEditando ? 'Editar Produto' : 'Novo Produto'}</h1>

          <form onSubmit={handleSubmit} className="produto-form">
            <div className="form-grid">
              {/* COLUDA ESQUERDA - IMAGEM */}
              <div className="form-image-section">
                <label className="form-label">Imagem</label>
                <div className="image-upload-area">
                  {imagemPreview ? (
                    <div className="image-preview-container">
                      <img src={imagemPreview} alt="Preview" className="image-preview" />
                      <button type="button" className="remove-image-btn" onClick={removerImagem}>
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="image-placeholder">
                      <Upload size={40} />
                      <span>Clique para selecionar</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="image-input" />
                    </label>
                  )}
                  <button 
                    type="button" 
                    className="upload-btn"
                    onClick={() => document.querySelector('.image-input')?.click()}
                    disabled={uploadando}
                  >
                    {uploadando ? 'Enviando...' : 'Selecionar imagem'}
                  </button>
                  <p className="image-hint">PNG, JPG até 2MB</p>
                </div>
              </div>

              {/* COLUNA DIREITA - CAMPOS */}
              <div className="form-fields-section">
                <div className="form-field">
                  <label className="form-label">Nome</label>
                  <input type="text" name="nome" value={formData.nome} onChange={handleChange} required className="form-input" />
                </div>

                <div className="form-field">
                  <label className="form-label">Slug</label>
                  <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="form-input" />
                </div>

                <div className="form-field">
                  <label className="form-label">Categoria</label>
                  <select name="categoria" value={formData.categoria} onChange={handleChange} className="form-select">
                    {categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label">Preço (R$)</label>
                    <input type="number" name="preco" value={formData.preco} onChange={handleChange} required step="0.01" className="form-input" />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Preço Original</label>
                    <input type="number" name="preco_original" value={formData.preco_original} onChange={handleChange} step="0.01" className="form-input" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label">Estoque</label>
                    <input type="number" name="estoque" value={formData.estoque} onChange={handleChange} required min="0" className="form-input" />
                  </div>
                  <div className="form-field checkbox-field">
                    <label className="checkbox-label">
                      <input type="checkbox" name="em_promocao" checked={formData.em_promocao} onChange={handleChange} />
                      Em promoção
                    </label>
                  </div>
                </div>

                <div className="form-field full-width">
                  <label className="form-label">Descrição</label>
                  <textarea name="descricao" value={formData.descricao} onChange={handleChange} rows="4" className="form-textarea" />
                </div>
              </div>
            </div>

            <div className="form-actions">
              {isEditando && (
                <button type="button" className="delete-btn" onClick={handleDelete} disabled={loading}>
                  <Trash2 size={16} /> Excluir
                </button>
              )}
              <button type="button" className="cancel-btn" onClick={() => navigate('/admin')}>Cancelar</button>
              <button type="submit" className="save-btn" disabled={loading}>
                <Save size={16} /> {loading ? 'Salvando...' : (isEditando ? 'Atualizar' : 'Criar')}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminProduto