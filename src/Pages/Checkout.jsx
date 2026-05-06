// src/Pages/Checkout.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { QrCode, CreditCard, FileText, CheckCircle } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/Authcontext'
import { supabase } from '../services/supabase'
import '../styles/Checkout.css'

function Checkout() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { cartItems, subtotal, desconto, total, clearCart } = useCart()
  
  const [processing, setProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('pix')
  const [parcelas, setParcelas] = useState(1)
  
  // Dados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    endereco: '',
    cep: '',
    cidade: '',
    estado: ''
  })

  // Pré-preenche com dados do usuário
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        nome: user.nome || '',
        email: user.email || ''
      }))
    }
  }, [user])

  // Verificar se está logado
  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  // Verificar se carrinho está vazio
  useEffect(() => {
    if (cartItems.length === 0 && !processing) {
      navigate('/carrinho')
    }
  }, [cartItems, navigate, processing])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const gerarNumeroPedido = () => {
    return `JSC${Date.now()}${Math.floor(Math.random() * 1000)}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validar formulário
    const requiredFields = ['nome', 'email', 'telefone', 'endereco', 'cidade', 'estado']
    for (const field of requiredFields) {
      if (!formData[field]) {
        alert(`Preencha o campo ${field}`)
        return
      }
    }
    
    setProcessing(true)
    
    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Criar pedido
    const numeroPedido = gerarNumeroPedido()
    
    const pedido = {
      numero_pedido: numeroPedido,
      usuario_id: user.id,
      usuario_nome: formData.nome,
      usuario_email: formData.email,
      usuario_endereco: `${formData.endereco}, ${formData.cidade} - ${formData.estado}, CEP: ${formData.cep}`,
      itens: cartItems.map(item => ({
        productId: item.productId,
        nome: item.nome,
        quantidade: item.quantidade,
        preco: item.preco
      })),
      subtotal: subtotal,
      desconto: desconto,
      total: total,
      cupom: null,
      forma_pagamento: paymentMethod,
      parcelas: paymentMethod === 'cartao' ? parcelas : 1,
      status: 'preparando'
    }
    
    // Salvar no Supabase
    const { error } = await supabase
      .from('pedidos')
      .insert([pedido])
    
    if (error) {
      console.error('Erro ao salvar pedido:', error)
      alert('Erro ao finalizar pedido. Tente novamente.')
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

  // Cálculo do valor da parcela
  const getValorParcela = () => {
    if (parcelas === 1) return total
    return total / parcelas
  }

  if (!user || cartItems.length === 0) {
    return null
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="checkout-title">Checkout</h1>
          <p className="checkout-subtitle">Complete seus dados para finalizar</p>

          <form onSubmit={handleSubmit}>
            {/* CARD 1 - DADOS DE ENTREGA */}
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
                <div className="form-field">
                  <input
                    type="text"
                    name="cpf"
                    placeholder="CPF"
                    value={formData.cpf}
                    onChange={handleInputChange}
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
                    name="cep"
                    placeholder="CEP"
                    value={formData.cep}
                    onChange={handleInputChange}
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
              </div>
            </div>

            {/* CARD 2 - FORMA DE PAGAMENTO */}
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

              {/* CARTÃO DE CRÉDITO (expandido) */}
              {paymentMethod === 'cartao' && (
                <div className="cartao-expandido">
                  <div className="form-field">
                    <input
                      type="text"
                      placeholder="Número do cartão"
                      className="form-input"
                    />
                  </div>
                  <div className="form-grid">
                    <div className="form-field">
                      <input
                        type="text"
                        placeholder="MM/AA"
                        className="form-input"
                      />
                    </div>
                    <div className="form-field">
                      <input
                        type="text"
                        placeholder="CVV"
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div className="form-field">
                    <select 
                      value={parcelas} 
                      onChange={(e) => setParcelas(Number(e.target.value))}
                      className="form-select"
                    >
                      <option value={1}>1x de R$ {total.toFixed(2)}</option>
                      <option value={2}>2x de R$ {(total / 2).toFixed(2)}</option>
                      <option value={3}>3x de R$ {(total / 3).toFixed(2)}</option>
                      <option value={4}>4x de R$ {(total / 4).toFixed(2)}</option>
                      <option value={5}>5x de R$ {(total / 5).toFixed(2)}</option>
                      <option value={6}>6x de R$ {(total / 6).toFixed(2)}</option>
                      <option value={10}>10x de R$ {(total / 10).toFixed(2)}</option>
                      <option value={12}>12x de R$ {(total / 12).toFixed(2)}</option>
                    </select>
                  </div>
                </div>
              )}

              {/* PIX */}
              {paymentMethod === 'pix' && (
                <p className="payment-message">
                  Você receberá o QR Code após confirmar o pedido.
                </p>
              )}

              {/* BOLETO */}
              {paymentMethod === 'boleto' && (
                <p className="payment-message">
                  O boleto será gerado e enviado para seu e-mail.
                </p>
              )}
            </div>

            {/* CARD 3 - RESUMO DO PEDIDO */}
            <div className="checkout-card">
              <h2 className="card-label">RESUMO DO PEDIDO</h2>
              
              <div className="resumo-items">
                {cartItems.map(item => (
                  <div key={item.productId} className="resumo-item">
                    <span>{item.nome} × {item.quantidade}</span>
                    <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
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

            {/* BOTÃO CONFIRMAR */}
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