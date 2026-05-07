// src/Pages/ResetarSenha.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'  // ← ADICIONE Link aqui!
import { motion } from 'framer-motion'
import { Leaf, Eye, EyeOff, Lock } from 'lucide-react'
import { supabase } from '../services/supabase'
import { toast, Toaster } from 'sonner'
import '../styles/ResetarSenha.css'

function ResetarSenha() {
  const { token } = useParams()
  const navigate = useNavigate()
  
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [tokenValido, setTokenValido] = useState(false)
  const [email, setEmail] = useState('')
  const [verificando, setVerificando] = useState(true)

  // Verificar token
  useEffect(() => {
    async function verificarToken() {
      const { data, error } = await supabase
        .from('reset_tokens')
        .select('*')
        .eq('token', token)
        .eq('used', false)
        .single()

      if (error || !data) {
        toast.error('Link inválido ou expirado')
        setVerificando(false)
        return
      }

      const expiresAt = new Date(data.expires_at)
      const now = new Date()

      if (expiresAt < now) {
        toast.error('Link expirado. Solicite um novo.')
        setVerificando(false)
        return
      }

      setEmail(data.email)
      setTokenValido(true)
      setVerificando(false)
    }

    verificarToken()
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (senha.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres')
      return
    }
    
    if (senha !== confirmarSenha) {
      toast.error('As senhas não coincidem')
      return
    }

    setLoading(true)

    // Atualizar senha do usuário
    const { error: updateError } = await supabase
      .from('perfis')
      .update({ senha: senha })
      .eq('email', email)

    if (updateError) {
      toast.error('Erro ao atualizar senha')
      setLoading(false)
      return
    }

    // Marcar token como usado
    await supabase
      .from('reset_tokens')
      .update({ used: true })
      .eq('token', token)

    toast.success('Senha alterada com sucesso!')
    setTimeout(() => {
      navigate('/login')
    }, 2000)
  }

  if (verificando) {
    return (
      <div className="resetar-page">
        <div className="resetar-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Verificando link...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!tokenValido) {
    return (
      <div className="resetar-page">
        <div className="resetar-container">
          <div className="error-state">
            <h2>Link inválido ou expirado</h2>
            <p>Solicite um novo link de recuperação.</p>
            <button onClick={() => navigate('/esqueci-senha')}>
              Solicitar novo link
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="resetar-page">
      <Toaster position="top-right" richColors />
      
      <div className="resetar-container">
        <motion.div
          className="resetar-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="resetar-icon">
            <Lock size={32} />
          </div>

          <h1 className="resetar-title">Criar nova senha</h1>
          <p className="resetar-subtitle">
            Digite sua nova senha para a conta <strong>{email}</strong>
          </p>

          <form onSubmit={handleSubmit} className="resetar-form">
            <div className="form-group">
              <label htmlFor="senha" className="form-label">
                Nova senha
              </label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  placeholder="Mínimo 6 caracteres"
                  className="form-input"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmarSenha" className="form-label">
                Confirmar nova senha
              </label>
              <div className="input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmarSenha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                  placeholder="Confirme sua senha"
                  className="form-input"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="resetar-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Alterando senha...
                </>
              ) : (
                'Alterar senha'
              )}
            </button>
          </form>

          <p className="resetar-footer">
            <Link to="/login" className="login-link">
              Voltar para o login
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default ResetarSenha