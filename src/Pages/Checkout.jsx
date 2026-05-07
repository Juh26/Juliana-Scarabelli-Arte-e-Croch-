// src/Pages/Checkout.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { QrCode, CreditCard, FileText } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/Authcontext'
import { supabase } from '../services/supabase'
import { toast, Toaster } from 'sonner'
import '../styles/Checkout.css'

function Checkout() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { cartItems, subtotal, desconto, total, clearCart } = useCart()
  
  const [processing, setProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('pix')
  const [parcelas, setParcelas] = useState(1)
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: ''
  })

  useEffect(() => {
    if (!user) {
      navigate('/login')
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        nome: user.nome || '',
        email: user.email || ''
      }))
    }
  }, [user, navigate])

  useEffect(() => {
    if (cartItems.length === 0 && !processing) {
      navigate('/carrinho')
    }
  }, [cartItems, navigate, processing])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    // Máscara para telefone
    if (name === 'telefone') {
      let telefoneValue = value.replace(/\D/g, '')
      if (telefoneValue.length <= 11) {
        telefoneValue = telefoneValue.replace(/^(\d{2})(\d)/, '($1) $2')
        telefoneValue = telefoneValue.replace(/(\d{5})(\d)/, '$1-$2')
        setFormData({ ...formData, telefone: telefoneValue })
      }
      return
    }
    
    // Máscara para CEP
    if (name === 'cep') {
      let cepValue = value.replace(/\D/g, '')
      if (cepValue.length <= 8) {
        cepValue = cepValue.replace(/^(\d{5})(\d)/, '$1-$2')
        setFormData({ ...formData, cep: cepValue })
      }
      return
    }
    
    setFormData({ ...formData, [name]: value })
  }

  const gerarNumeroPedido = () => {
    return `JSC${Date.now()}${Math.floor(Math.random() * 1000)}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // ============================================
    // VALIDAÇÕES OBRIGATÓRIAS
    // ============================================
    
    if (!formData.nome || formData.nome.trim() === '') {
      toast.error('Por favor, preencha seu nome completo')
      return
    }
    
    if (!formData.email || !formData.email.includes('@')) {
      toast.error('Por favor, preencha um e-mail válido')
      return
    }
    
    if (!formData.endereco || formData.endereco.trim() === '') {
      toast.error('Por favor, preencha seu endereço')
      return
    }
    
    if (!formData.cidade || formData.cidade.trim() === '') {
      toast.error('Por favor, preencha sua cidade')
      return
    }
    
    if (!formData.estado || formData.estado.trim() === '') {
      toast.error('Por favor, preencha seu estado')
      return
    }
    
    if (!formData.telefone || formData.telefone.trim() === '') {
      toast.error('Por favor, preencha seu telefone')
      return
    }
    
    // Validação de CEP (se preenchido)
    if (formData.cep && formData.cep.replace(/\D/g, '').length < 8) {
      toast.warning('Verifique se o CEP está correto')
      return
    }
    
    setProcessing(true)

    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const numeroPedido = gerarNumeroPedido()
    
    const pedido = {
      numero_pedido: numeroPedido,
      usuario_id: user.id,
      usuario_nome: formData.nome,
      usuario_email: formData.email,
      usuario_endereco: `${formData.endereco}, ${formData.cidade} - ${formData.estado}`,
      itens: cartItems.map(item => ({
        productId: item.productId,
        nome: item.nome,
        quantidade: item.quantidade,
        preco: item.preco
      })),
      subtotal: subtotal,
      desconto: desconto,
      total: total,
      forma_pagamento: paymentMethod,
      parcelas: paymentMethod === 'cartao' ? parcelas : 1,
      status: 'preparando'
    }
    
    const { error } = await supabase
      .from('pedidos')
      .insert([pedido])
    
    if (error) {
      console.error('Erro ao salvar:', error)
      toast.error(`Erro: ${error.message}`)
      setProcessing(false)
      return
    }
    
    // Limpar carrinho
    clearCart()
    
    // Redirecionar para confirmação
    navigate('/pedido-confirmado', { 
      state: { 
        numeroPedido,
        total,
        paymentMethod
      } 
    })
  }

  if (!user || cartItems.length === 0) {
    return null
  }

  return (
    <div className="checkout-page">
      <Toaster position="top-right" richColors />
      
      <div className="checkout-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="checkout-title">Checkout</h1>
          <p className="checkout-subtitle">Complete seus dados para finalizar</p>

          <form onSubmit={handleSubmit}>
            {/* DADOS DE ENTREGA */}
            <div className="checkout-card">
              <h2 className="card-label">DADOS DE ENTREGA</h2>
              <div className="form-grid">
                <div className="form-field">
                  <input
                    type="text"
                    name="nome"
                    placeholder="Nome completo"
                    value={formData.nome}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <input
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <input
                    type="tel"
                    name="telefone"
                    placeholder="Telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-field full-width">
                  <input
                    type="text"
                    name="endereco"
                    placeholder="Endereço"
                    value={formData.endereco}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <input
                    type="text"
                    name="cidade"
                    placeholder="Cidade"
                    value={formData.cidade}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <input
                    type="text"
                    name="estado"
                    placeholder="Estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <input
                    type="text"
                    name="cep"
                    placeholder="CEP"
                    value={formData.cep}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* FORMA DE PAGAMENTO */}
            <div className="checkout-card">
              <h2 className="card-label">FORMA DE PAGAMENTO</h2>
              <div className="payment-methods">
                <button
                  type="button"
                  className={`payment-btn ${paymentMethod === 'pix' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('pix')}
                >
                  <QrCode size={20} />
                  <span>PIX</span>
                </button>
                <button
                  type="button"
                  className={`payment-btn ${paymentMethod === 'cartao' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('cartao')}
                >
                  <CreditCard size={20} />
                  <span>Cartão</span>
                </button>
                <button
                  type="button"
                  className={`payment-btn ${paymentMethod === 'boleto' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('boleto')}
                >
                  <FileText size={20} />
                  <span>Boleto</span>
                </button>
              </div>
              
              {paymentMethod === 'pix' && (
                <p className="payment-message">Você receberá o QR Code após confirmar o pedido.</p>
              )}
              {paymentMethod === 'boleto' && (
                <p className="payment-message">O boleto será gerado e enviado para seu e-mail.</p>
              )}
            </div>

            {/* RESUMO DO PEDIDO */}
            <div className="checkout-card">
              <h2 className="card-label">RESUMO DO PEDIDO</h2>
              
              {cartItems.map(item => (
                <div key={item.productId} className="resumo-item">
                  <span>{item.nome} × {item.quantidade}</span>
                  <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                </div>
              ))}
              
              <div className="resumo-divider"></div>
              
              <div className="resumo-linha">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              
              {desconto > 0 && (
                <div className="resumo-linha desconto">
                  <span>Desconto</span>
                  <span>- R$ {desconto.toFixed(2)}</span>
                </div>
              )}
              
              <div className="resumo-total">
                <span>Total</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              type="submit" 
              className="confirmar-btn"
              disabled={processing}
            >
              {processing ? (
                <>
                  <div className="spinner-small"></div>
                  Processando...
                </>
              ) : (
                `Confirmar pedido — R$ ${total.toFixed(2)}`
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default Checkout