import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle, MapPin, Mail, Phone } from 'lucide-react'
import '../styles/Contato.css'

function Contato() {
  const navigate = useNavigate()
  const [enviado, setEnviado] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    mensagem: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Formulário enviado:', formData)
    setEnviado(true)
  }

  return (
    <div className="contato-container">
      {/* Conteúdo da página */}
      <motion.div 
        className="contato-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {!enviado ? (
          <div className="contato-grid">
            {/* Coluna Esquerda - Formulário */}
            <div className="contato-formulario">
              <h1 className="contato-titulo">Contato</h1>
              <p className="contato-subtitulo">
                Tem alguma dúvida ou quer encomendar uma peça especial?
              </p>

              <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                  <label htmlFor="nome" className="form-label">
                    Nome
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    placeholder="Seu nome"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="seu@email.com"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="mensagem" className="form-label">
                    Mensagem
                  </label>
                  <textarea
                    id="mensagem"
                    name="mensagem"
                    value={formData.mensagem}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Escreva sua mensagem..."
                    className="form-textarea"
                  />
                </div>

                <button type="submit" className="btn-enviar">
                  <Send size={14} />
                  Enviar mensagem
                </button>
              </form>
            </div>

            {/* Coluna Direita - Informações */}
            <div className="contato-info">
              <div className="info-card">
                <h2 className="info-titulo">Nosso Ateliê</h2>
                
                <div className="info-item">
                  <MapPin size={16} className="info-icon" />
                  <span>Muriaé, MG — Brasil</span>
                </div>
                
                <div className="info-item">
                  <Mail size={16} className="info-icon" />
                  <span>contato@julianascarabelli.com</span>
                </div>
                
                <div className="info-item">
                  <Phone size={16} className="info-icon" />
                  <span>(32) 99999-0000</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Tela de Sucesso */
          <motion.div 
            className="sucesso-container"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <CheckCircle size={48} className="sucesso-icon" />
            <h2 className="sucesso-titulo">Mensagem enviada!</h2>
            <p className="sucesso-texto">
              Obrigada pelo contato. Responderemos em breve.
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Botão voltar */}
      <button className="back-button" onClick={() => navigate('/')}>
        ← Voltar
      </button>
    </div>
  )
}

export default Contato