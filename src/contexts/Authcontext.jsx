// src/contexts/Authcontext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'sonner'
import { supabase } from '../services/supabase'

const AuthContext = createContext({})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('jsc_current_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, senha) => {
    try {
      // Buscar usuário no Supabase
      const { data: userData, error } = await supabase
        .from('perfis')
        .select('*')
        .eq('email', email)
        .single()

      if (error || !userData) {
        toast.error('E-mail ou senha incorretos')
        return { success: false }
      }

      // Verificar senha
      if (userData.senha !== senha) {
        toast.error('E-mail ou senha incorretos')
        return { success: false }
      }

      // Verificar se e-mail foi verificado
      if (!userData.verified) {
        toast.warning('Por favor, verifique seu e-mail antes de fazer login')
        return { success: false }
      }

      // Garantir que o admin tenha role 'admin'
      let role = userData.role
      if (email === 'isa2121@gmail.com') {
        role = 'admin'
      }

      // Salvar usuário (remover senha)
      const userWithoutPassword = {
        id: userData.id,
        nome: userData.nome,
        email: userData.email,
        role: role,
        verified: userData.verified
      }
      
      localStorage.setItem('jsc_current_user', JSON.stringify(userWithoutPassword))
      setUser(userWithoutPassword)
      
      toast.success(`Bem-vinda, ${userData.nome}!`)
      return { success: true, user: userWithoutPassword }

    } catch (err) {
      console.error('Erro no login:', err)
      toast.error('Erro ao fazer login')
      return { success: false }
    }
  }

  const register = async (nome, email, senha) => {
    try {
      // Verificar se e-mail já existe
      const { data: existing } = await supabase
        .from('perfis')
        .select('email')
        .eq('email', email)
        .single()

      if (existing) {
        toast.error('Este e-mail já está cadastrado')
        return { success: false }
      }

      // Criar novo usuário
      const { data, error } = await supabase
        .from('perfis')
        .insert([{
          nome,
          email,
          senha,
          role: 'user',
          verified: true
        }])
        .select()
        .single()

      if (error) {
        toast.error('Erro ao criar conta')
        return { success: false }
      }

      toast.success('Conta criada! Faça login.')
      return { success: true }

    } catch (err) {
      console.error('Erro no cadastro:', err)
      toast.error('Erro ao criar conta')
      return { success: false }
    }
  }

  const logout = () => {
    localStorage.removeItem('jsc_current_user')
    setUser(null)
    toast.success('Você saiu da sua conta')
  }

  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}