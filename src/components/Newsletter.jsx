// src/components/Newsletter.jsx
import { useState } from 'react'
import { Mail, Send, CheckCircle } from 'lucide-react'
import { supabase } from '../services/supabase'
import { toast } from 'sonner'
import '../styles/Newsletter.css'

function Newsletter() {
  const [email, setEmail] = useState('')
  const [nome, setNome] = useState('')
  const [loading, setLoading] = useState(false)
  const [inscrito, setInscrito] = useState(false)

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
    
    // Verificar se já está inscrito
    const { data: existente } = await supabase
      .from('newsletter')
      .select('email')
      .eq('email', email)
      .single()
    
    if (existente) {
      toast.info('Este e-mail já está cadastrado na newsletter!')
      setLoading(false)
      return
    }
    
    // Salvar na newsletter
    const { error } = await supabase
      .from('newsletter')
      .insert([{
        email: email,
        nome: nome || null
      }])
    
    if (error) {
      console.error('Erro ao cadastrar:', error)
      toast.error('Erro ao cadastrar. Tente novamente.')
    } else {
      toast.success('Inscrição realizada com sucesso! 📧')
      setInscrito(true)
      setEmail('')
      setNome('')
    }
    
    setLoading(false)
  }

  if (inscrito) {
    return (
      <div className="newsletter-inscrito">
        <CheckCircle size={32} className="inscrito-icon" />
        <h4>Inscrição confirmada!</h4>
        <p>Você receberá nossas novidades por e-mail.</p>
      </div>
    )
  }

  return (
    <div className="newsletter">
      <div className="newsletter-header">
        <Mail size={20} className="newsletter-icon" />
        <h3 className="newsletter-title">Receba novidades</h3>
        <p className="newsletter-text">
          Cadastre-se para receber promoções e lançamentos exclusivos
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="newsletter-form">
        <div className="newsletter-input-group">
          <input
            type="text"
            placeholder="Seu nome (opcional)"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="newsletter-input nome"
          />
          <input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="newsletter-input email"
          />
          <button 
            type="submit" 
            className="newsletter-btn"
            disabled={loading}
          >
            {loading ? (
              <div className="spinner-small"></div>
            ) : (
              <>
                <Send size={14} />
                Cadastrar
              </>
            )}
          </button>
        </div>
      </form>
      
      <p className="newsletter-obs">
        ✨ Não enviamos spam. Você pode cancelar a qualquer momento.
      </p>
    </div>
  )
}

export default Newsletter