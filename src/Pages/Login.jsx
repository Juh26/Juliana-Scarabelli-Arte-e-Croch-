// src/Pages/Login.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Leaf, Eye, EyeOff } from 'lucide-react'
import { supabase } from '../services/supabase'
import { toast, Toaster } from 'sonner'
import '../styles/Login.css'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !senha) {
      toast.error('Preencha todos os campos')
      return
    }

    setLoading(true)

    try {
      // Buscar usuário no Supabase
      const { data: user, error } = await supabase
        .from('perfis')
        .select('*')
        .eq('email', email)
        .single()

      if (error || !user) {
        toast.error('E-mail ou senha incorretos')
        setLoading(false)
        return
      }

      if (user.senha !== senha) {
        toast.error('E-mail ou senha incorretos')
        setLoading(false)
        return
      }

      // Login bem-sucedido
      const { senha: _, ...userWithoutPassword } = user
      localStorage.setItem('jsc_current_user', JSON.stringify(userWithoutPassword))

      toast.success(`Bem-vinda, ${user.nome}!`)
      setLoading(false)

      if (user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/loja')
      }

    } catch (err) {
      console.error('Erro no login:', err)
      toast.error('Erro ao fazer login')
      setLoading(false)
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