// src/Pages/PedidoConfirmado.jsx
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'
import '../styles/PedidoConfirmado.css'

function PedidoConfirmado() {
  const location = useLocation()
  const navigate = useNavigate()
  const { numeroPedido, total, paymentMethod } = location.state || {}

  if (!numeroPedido) {
    navigate('/loja')
    return null
  }

  return (
    <div className="confirmado-page">
      <div className="confirmado-container">
        <motion.div
          className="confirmado-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="confirmado-icon">
            <CheckCircle size={64} />
          </div>
          
          <h1 className="confirmado-title">Pedido Confirmado!</h1>
          <p className="confirmado-subtitle">
            Obrigada pela compra! Você pode acompanhar o status do seu pedido.
          </p>
          
          <div className="confirmado-detalhes">
            <div className="detalhe-item">
              <span>Número do pedido</span>
              <strong>{numeroPedido}</strong>
            </div>
            <div className="detalhe-item">
              <span>Total</span>
              <strong>R$ {total?.toFixed(2)}</strong>
            </div>
            <div className="detalhe-item">
              <span>Forma de pagamento</span>
              <strong>
                {paymentMethod === 'pix' ? 'PIX' : 
                 paymentMethod === 'cartao' ? 'Cartão de Crédito' : 'Boleto Bancário'}
              </strong>
            </div>
          </div>
          
          <div className="confirmado-acoes">
            <button 
              className="btn-primary"
              onClick={() => navigate('/meus-pedidos')}
            >
              <Package size={16} />
              Ver meus pedidos
            </button>
            <button 
              className="btn-secondary"
              onClick={() => navigate('/loja')}
            >
              Continuar comprando
              <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PedidoConfirmado