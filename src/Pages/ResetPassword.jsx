// src/Pages/ResetPassword.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { toast, Toaster } from 'sonner'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff } from 'lucide-react'
import '../styles/ResetPassword.css'

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Verificar se o usuário está autenticado via token da URL
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Link inválido ou expirado')
        navigate('/login')
      }
    }
    checkSession()
  }, [navigate])

  const handleResetPassword = async (e) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem')
      return
    }
    
    if (newPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres')
      return
    }
    
    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Senha alterada com sucesso! Faça login.')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    }
    setLoading(false)
  }

  return (
    <div className="reset-password-page">
      <Toaster position="top-right" richColors />
      
      <div className="reset-password-container">
        <motion.div
          className="reset-password-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="reset-password-icon">
            <Lock size={32} />
          </div>

          <h1 className="reset-password-title">Criar nova senha</h1>
          <p className="reset-password-subtitle">
            Digite sua nova senha para acessar sua conta
          </p>

          <form onSubmit={handleResetPassword} className="reset-password-form">
            <div className="form-group">
              <label className="form-label">Nova senha</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
              <label className="form-label">Confirmar senha</label>
              <div className="password-wrapper">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirme sua nova senha"
                  className="form-input"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="reset-password-btn"
              disabled={loading}
            >
              {loading ? 'Alterando...' : 'Alterar senha'}
            </button>
          </form>

          <p className="reset-password-footer">
            <button 
              onClick={() => navigate('/login')} 
              className="back-to-login"
            >
              Voltar para o login
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default ResetPassword