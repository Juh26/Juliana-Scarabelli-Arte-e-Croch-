// src/Pages/Login.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Leaf, Eye, EyeOff } from 'lucide-react'
import { toast, Toaster } from 'sonner'
import { useAuth } from '../contexts/Authcontext'
import '../styles/Login.css'

function Login() {
  const navigate = useNavigate()
  const { login, user } = useAuth()  // ← Pegar o user do context
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Debug: Verificar se o usuário está logado
  console.log('Usuário no Login:', user)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await login(email, senha)
    
    setLoading(false)

    if (result.success) {
      if (result.user?.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/loja')
      }
    }
  }

  return (
    <div className="login-page">
      <Toaster position="top-right" richColors />
      
      <div className="login-container">
        <motion.div 
          className="login-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="login-icon">
            <Leaf size={32} />
          </div>

          <h1 className="login-title">Entrar</h1>
          <p className="login-subtitle">
            Bem-vinda de volta à Juliana Scarabelli Crochê
          </p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                E-mail
              </label>
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

            <div className="form-group">
              <label htmlFor="senha" className="form-label">
                Senha
              </label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  placeholder="Sua senha"
                  className="form-input password-input"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="login-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>

            <Link to="/esqueci-senha" className="forgot-link">
              Esqueci minha senha
            </Link>
          </form>

          <div className="separator">
            <span className="separator-line"></span>
            <span className="separator-text">ou</span>
            <span className="separator-line"></span>
          </div>

          <p className="register-text">
            Não tem conta?{' '}
            <Link to="/cadastro" className="register-link">
              Criar conta
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Login