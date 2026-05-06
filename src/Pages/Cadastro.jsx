// src/Pages/Cadastro.jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Leaf, Eye, EyeOff } from 'lucide-react'
import { toast, Toaster } from 'sonner'
import { supabase } from '../services/supabase'
import '../styles/Cadastro.css'

function Cadastro() {
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [aceitouTermos, setAceitouTermos] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [senhaForte, setSenhaForte] = useState(false)
  const [senhaMedia, setSenhaMedia] = useState(false)
  const [senhaFraca, setSenhaFraca] = useState(false)

  // Validar força da senha
  useEffect(() => {
    const forcaSenha = (senha) => {
      let forca = 0
      if (senha.length >= 6) forca++
      if (senha.length >= 8) forca++
      if (/[A-Z]/.test(senha)) forca++
      if (/[0-9]/.test(senha)) forca++
      if (/[^A-Za-z0-9]/.test(senha)) forca++
      return forca
    }
    
    const forca = forcaSenha(senha)
    setSenhaFraca(senha.length > 0 && forca < 2)
    setSenhaMedia(senha.length > 0 && forca >= 2 && forca < 4)
    setSenhaForte(senha.length > 0 && forca >= 4)
  }, [senha])

  const senhasCoincidem = senha === confirmarSenha && senha !== ''
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  
  const podeCadastrar = 
    nome.trim() !== '' &&
    emailValido &&
    senha.length >= 6 &&
    senhasCoincidem &&
    aceitouTermos &&
    !loading

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!podeCadastrar) return
    
    setLoading(true)

    try {
      // Verificar se e-mail já existe
      const { data: existingUser, error: checkError } = await supabase
        .from('perfis')
        .select('email')
        .eq('email', email)
        .maybeSingle() // Usar maybeSingle em vez de single para não dar erro

      if (existingUser) {
        toast.error('Este e-mail já está cadastrado')
        setLoading(false)
        return
      }

      // Criar novo usuário
      const novoUsuario = {
        nome: nome,
        email: email,
        senha: senha,
        role: 'user',
        verified: false,
        created_at: new Date().toISOString()
      }

      console.log('Tentando cadastrar:', novoUsuario)

      const { data, error } = await supabase
        .from('perfis')
        .insert([novoUsuario])
        .select()

      if (error) {
        console.error('Erro detalhado do Supabase:', error)
        toast.error(`Erro: ${error.message}`)
        setLoading(false)
        return
      }

      console.log('Usuário criado com sucesso:', data)
      toast.success('Conta criada! Verifique seu e-mail.')
      setLoading(false)

      setTimeout(() => {
        navigate('/login')
      }, 2000)

    } catch (err) {
      console.error('Erro inesperado:', err)
      toast.error('Erro ao criar conta. Tente novamente.')
      setLoading(false)
    }
  }

  const getSenhaForcaCor = () => {
    if (senhaFraca) return '#e74c3c'
    if (senhaMedia) return '#f5a623'
    if (senhaForte) return '#6b8c5c'
    return '#e8dfd3'
  }

  const getSenhaForcaLargura = () => {
    if (senhaFraca) return '33%'
    if (senhaMedia) return '66%'
    if (senhaForte) return '100%'
    return '0%'
  }

  return (
    <div className="cadastro-page">
      <Toaster position="top-right" richColors />
      
      <div className="cadastro-container">
        <motion.div 
          className="cadastro-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="cadastro-icon">
            <Leaf size={32} />
          </div>

          <h1 className="cadastro-title">Criar Conta</h1>
          <p className="cadastro-subtitle">
            Junte-se à família Juliana Scarabelli Crochê
          </p>

          <form onSubmit={handleSubmit} className="cadastro-form">
            <div className="form-group">
              <label htmlFor="nome" className="form-label">
                Nome Completo
              </label>
              <input
                type="text"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                placeholder="Seu nome completo"
                className="form-input"
                disabled={loading}
              />
            </div>

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
                className={`form-input ${email && !emailValido ? 'input-error' : ''}`}
                disabled={loading}
              />
              {email && !emailValido && (
                <p className="error-message">Digite um e-mail válido</p>
              )}
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
                  placeholder="Mínimo 6 caracteres"
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
              
              {senha.length > 0 && (
                <div className="senha-forca-container">
                  <div 
                    className="senha-forca-bar" 
                    style={{ 
                      width: getSenhaForcaLargura(),
                      backgroundColor: getSenhaForcaCor()
                    }}
                  ></div>
                  <span className="senha-forca-texto">
                    {senhaFraca && 'Senha fraca'}
                    {senhaMedia && 'Senha média'}
                    {senhaForte && 'Senha forte'}
                  </span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmarSenha" className="form-label">
                Confirmar Senha
              </label>
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmarSenha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                  placeholder="Confirme sua senha"
                  className={`form-input password-input ${confirmarSenha && !senhasCoincidem ? 'input-error' : ''}`}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {confirmarSenha && !senhasCoincidem && (
                <p className="error-message">As senhas não coincidem</p>
              )}
            </div>

            <label className="termos-container">
              <input
                type="checkbox"
                checked={aceitouTermos}
                onChange={(e) => setAceitouTermos(e.target.checked)}
                className="termos-checkbox"
                disabled={loading}
              />
              <span className="termos-texto">
                Li e aceito os 
                <Link to="/termos" className="termos-link"> Termos de Uso</Link> e 
                <Link to="/privacidade" className="termos-link"> Política de Privacidade</Link>
              </span>
            </label>

            <button 
              type="submit" 
              className="cadastro-btn"
              disabled={!podeCadastrar}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Criando conta...
                </>
              ) : (
                'Criar Conta'
              )}
            </button>
          </form>

          <p className="login-text">
            Já tem conta?{' '}
            <Link to="/login" className="login-link">
              Entrar
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Cadastro