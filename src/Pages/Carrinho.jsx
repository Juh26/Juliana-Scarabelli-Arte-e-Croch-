// src/Pages/Carrinho.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingBag, Trash2, Minus, Plus, Tag, 
  ArrowRight, X
} from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/Authcontext'
import '../styles/Carrinho.css'

function Carrinho() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { 
    cartItems, 
    subtotal, 
    desconto, 
    total, 
    descontoPercent,
    cupom,
    updateQuantity, 
    removeItem, 
    applyCupom,
    removeCupom
  } = useCart()
  
  const [codigoCupom, setCodigoCupom] = useState('')
  const [cupomStatus, setCupomStatus] = useState(null)

  const handleApplyCupom = () => {
    if (applyCupom(codigoCupom)) {
      setCupomStatus('success')
    } else {
      setCupomStatus('error')
    }
  }

  const handleCheckout = () => {
    if (!user) {
      navigate('/login')
    } else {
      navigate('/checkout')
    }
  }

  // Função para verificar se a imagem é uma URL válida
  const getImagemUrl = (item) => {
    if (item.imagem && (item.imagem.startsWith('http') || item.imagem.includes('supabase'))) {
      return item.imagem
    }
    return null
  }

  // Carrinho vazio
  if (cartItems.length === 0) {
    return (
      <div className="carrinho-page">
        <div className="carrinho-container">
          <div className="carrinho-vazio">
            <div className="vazio-icon">
              <ShoppingBag size={64} />
            </div>
            <h2 className="vazio-title">Seu carrinho está vazio</h2>
            <p className="vazio-subtitle">
              Parece que você ainda não adicionou nenhum produto ao carrinho.
            </p>
            <Link to="/loja" className="vazio-btn">
              Ver produtos
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="carrinho-page">
      <div className="carrinho-container">
        <h1 className="carrinho-title">
          Sacola ({cartItems.reduce((acc, item) => acc + item.quantidade, 0)})
        </h1>

        <div className="carrinho-grid">
          {/* Lista de Itens */}
          <div className="carrinho-items">
            <AnimatePresence mode="popLayout">
              {cartItems.map((item) => {
                const imagemUrl = getImagemUrl(item)
                return (
                  <motion.div
                    key={item.productId}
                    className="carrinho-item"
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Thumbnail da imagem */}
                    <div className="item-thumbnail">
                      {imagemUrl ? (
                        <img 
                          src={imagemUrl} 
                          alt={item.nome} 
                          className="item-imagem"
                        />
                      ) : (
                        <span className="item-emoji">{item.imagem || '🧶'}</span>
                      )}
                    </div>

                    {/* Informações */}
                    <div className="item-info">
                      <h3 className="item-nome">{item.nome}</h3>
                      <p className="item-preco">R$ {item.preco.toFixed(2)}</p>
                      <p className="item-subtotal">
                        Subtotal: R$ {(item.preco * item.quantidade).toFixed(2)}
                      </p>
                    </div>

                    {/* Controles */}
                    <div className="item-controles">
                      <div className="quantidade-control">
                        <button 
                          className="qty-btn"
                          onClick={() => updateQuantity(item.productId, item.quantidade - 1)}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="qty-value">{item.quantidade}</span>
                        <button 
                          className="qty-btn"
                          onClick={() => updateQuantity(item.productId, item.quantidade + 1)}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button 
                        className="remove-btn"
                        onClick={() => removeItem(item.productId)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Resumo */}
          <div className="carrinho-resumo">
            <h3 className="resumo-title">Resumo do pedido</h3>

            <div className="cupom-section">
              <div className="cupom-input-wrapper">
                <Tag size={16} className="cupom-icon" />
                <input
                  type="text"
                  placeholder="Código do cupom"
                  value={codigoCupom}
                  onChange={(e) => setCodigoCupom(e.target.value)}
                  className="cupom-input"
                />
              </div>
              <button 
                onClick={handleApplyCupom}
                className="cupom-btn"
                disabled={!!cupom}
              >
                Aplicar
              </button>
            </div>

            {cupom && (
              <div className="cupom-ativo">
                <span>Cupom {cupom} aplicado! ({descontoPercent}% off)</span>
                <button onClick={removeCupom} className="cupom-remove">
                  <X size={14} />
                </button>
              </div>
            )}

            {cupomStatus === 'error' && (
              <p className="cupom-error">Cupom inválido. Tente PRIMEIRA10</p>
            )}

            <div className="resumo-linha">
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>

            {desconto > 0 && (
              <div className="resumo-linha desconto">
                <span>Desconto ({descontoPercent}%)</span>
                <span>- R$ {desconto.toFixed(2)}</span>
              </div>
            )}

            <div className="resumo-divider"></div>

            <div className="resumo-total">
              <span>Total</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>

            <button 
              onClick={handleCheckout}
              className="checkout-btn"
            >
              Finalizar compra
              <ArrowRight size={16} />
            </button>

            <Link to="/loja" className="continuar-comprando">
              Continuar comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Carrinho