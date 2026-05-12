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

    if (!email.includes('@')) {
      toast.error('Digite um e-mail válido')
      return
    }

    setLoading(true)

    try {
      // 1. Verificar se o e-mail existe no banco
      const { data: user, error: userError } = await supabase
        .from('perfis')
        .select('email')
        .eq('email', email)
        .single()

      if (userError || !user) {
        toast.error('E-mail não encontrado')
        setLoading(false)
        return
      }

      // 2. Gerar token único
      const token = Math.random().toString(36).substring(2, 15) + 
                    Math.random().toString(36).substring(2, 15)
      
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 1) // Expira em 1 hora

      // 3. Salvar token no banco
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

      // 4. Criar link de reset
      const resetLink = `${window.location.origin}/resetar-senha/${token}`

      // 5. Enviar e-mail via Resend (chamando nossa API)
      const response = await fetch('/api/send-reset-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          resetLink,
          nome: user.nome || 'cliente'
        })
      })

      const result = await response.json()

      if (!result.success) {
        console.error('Erro ao enviar e-mail:', result.error)
        toast.error('Erro ao enviar e-mail. Tente novamente.')
        setLoading(false)
        return
      }

      toast.success('Enviamos um link de recuperação para seu e-mail')
      setEnviado(true)
      
    } catch (err) {
      console.error('Erro inesperado:', err)
      toast.error('Erro ao processar solicitação')
    } finally {
      setLoading(false)
    }
  }

  // Tela de sucesso após envio
  if (enviado) {
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