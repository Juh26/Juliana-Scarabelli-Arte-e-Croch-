// src/Pages/EsqueciSenha.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Leaf, Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { supabase } from '../services/supabase'
import { toast, Toaster } from 'sonner'
import '../styles/EsqueciSenha.css'

function EsqueciSenha() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Digite seu e-mail')
      return
    }

    setLoading(true)

    // Verificar se o e-mail existe
    const { data: user, error } = await supabase
      .from('perfis')
      .select('email')
      .eq('email', email)
      .single()

    if (error || !user) {
      toast.error('E-mail não encontrado')
      setLoading(false)
      return
    }

    // Gerar token único
    const token = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15)
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1) // Expira em 1 hora

    // Salvar token no banco
    const { error: tokenError } = await supabase
      .from('reset_tokens')
      .insert([{
        email: email,
        token: token,
        expires_at: expiresAt.toISOString(),
        used: false
      }])

    if (tokenError) {
      console.error('Erro ao salvar token:', tokenError)
      toast.error('Erro ao processar solicitação')
      setLoading(false)
      return
    }

    // Aqui você enviaria um e-mail real
    // Por enquanto, vamos mostrar o link no console
    const resetLink = `${window.location.origin}/resetar-senha/${token}`
    console.log('Link de recuperação:', resetLink)
    
    toast.success('Link de recuperação foi gerado!')
    setEnviado(true)
    setLoading(false)
  }

  if (enviado) {
    return (
      <div className="esqueci-page">
        <div className="esqueci-container">
          <motion.div
            className="esqueci-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="esqueci-icon">
              <CheckCircle size={48} />
            </div>
            <h1 className="esqueci-title">E-mail enviado!</h1>
            <p className="esqueci-text">
              Enviamos um link de recuperação para <strong>{email}</strong>.
              Clique no link para criar uma nova senha.
            </p>
            <button 
              className="esqueci-btn"
              onClick={() => navigate('/login')}
            >
              Voltar para o login
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="esqueci-page">
      <Toaster position="top-right" richColors />
      
      <div className="esqueci-container">
        <motion.div
          className="esqueci-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button className="back-to-login" onClick={() => navigate('/login')}>
            <ArrowLeft size={16} />
            Voltar
          </button>

          <div className="esqueci-icon">
            <Leaf size={32} />
          </div>

          <h1 className="esqueci-title">Esqueci minha senha</h1>
          <p className="esqueci-subtitle">
            Digite seu e-mail e enviaremos um link para redefinir sua senha.
          </p>

          <form onSubmit={handleSubmit} className="esqueci-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                E-mail
              </label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                  className="form-input"
                  disabled={loading}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="esqueci-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Enviando...
                </>
              ) : (
                'Enviar link de recuperação'
              )}
            </button>
          </form>

          <p className="esqueci-footer">
            Lembrou sua senha?{' '}
            <Link to="/login" className="login-link">
              Voltar para login
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default EsqueciSenha