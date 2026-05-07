// src/Pages/MeusPedidos.jsx
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, ShoppingBag, X, Trash2, Clock, Truck, Check } from 'lucide-react'
import { supabase } from '../services/supabase'
import { useAuth } from '../contexts/Authcontext'
import OrderTracking from '../components/OrderTracking'
import '../styles/MeusPedidos.css'

function MeusPedidos() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [pedidos, setPedidos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [acaoId, setAcaoId] = useState(null)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    carregarPedidos()
  }, [user])

  const carregarPedidos = async () => {
    setCarregando(true)
    
    const { data, error } = await supabase
      .from('pedidos')
      .select('*')
      .eq('usuario_id', user.id)
      .neq('status', 'cancelado')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao carregar pedidos:', error)
    } else {
      setPedidos(data || [])
    }
    
    setCarregando(false)
  }

  const cancelarPedido = async (pedidoId) => {
    if (!window.confirm('Tem certeza que deseja cancelar este pedido?')) return
    
    setAcaoId(pedidoId)
    
    const { error } = await supabase
      .from('pedidos')
      .update({ status: 'cancelado' })
      .eq('id', pedidoId)

    if (error) {
      alert('Erro ao cancelar pedido')
    } else {
      setPedidos(pedidos.filter(p => p.id !== pedidoId))
      alert('Pedido cancelado com sucesso!')
    }
    
    setAcaoId(null)
  }

  const excluirPedido = async (pedidoId) => {
    if (!window.confirm('Tem certeza que deseja excluir este pedido permanentemente?')) return
    
    setAcaoId(pedidoId)
    
    const { error } = await supabase
      .from('pedidos')
      .delete()
      .eq('id', pedidoId)

    if (error) {
      alert('Erro ao excluir pedido')
    } else {
      setPedidos(pedidos.filter(p => p.id !== pedidoId))
      alert('Pedido excluído com sucesso!')
    }
    
    setAcaoId(null)
  }

  const formatarData = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatarMoeda = (valor) => {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'preparando':
        return { label: 'Preparando', variant: 'outline', icon: Clock }
      case 'caminho':
        return { label: 'A caminho', variant: 'secondary', icon: Truck }
      case 'entregue':
        return { label: 'Entregue', variant: 'default', icon: Check }
      default:
        return { label: status, variant: 'default', icon: Package }
    }
  }

  if (!user) return null

  return (
    <div className="meus-pedidos-page">
      <div className="meus-pedidos-container">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="meus-pedidos-title">Meus Pedidos</h1>
          <p className="meus-pedidos-subtitle">
            Acompanhe o status dos seus pedidos
          </p>

          {carregando ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Carregando pedidos...</p>
            </div>
          ) : pedidos.length === 0 ? (
            <div className="empty-state">
              <Package size={48} className="empty-icon" />
              <h3>Você ainda não fez nenhum pedido.</h3>
              <p>Que tal começar comprando algo especial?</p>
              <Link to="/loja" className="empty-btn">
                <ShoppingBag size={16} />
                Começar a comprar
              </Link>
            </div>
          ) : (
            <div className="pedidos-list">
              {pedidos.map((pedido) => {
                const statusInfo = getStatusBadge(pedido.status)
                const StatusIcon = statusInfo.icon
                
                return (
                  <div key={pedido.id} className="pedido-card">
                    {/* Cabeçalho */}
                    <div className="pedido-header">
                      <div className="pedido-id">
                        <Package size={18} />
                        <span>Pedido #{pedido.id.toString().slice(-6)}</span>
                      </div>
                      <div className="pedido-info-header">
                        <span className="pedido-data">{formatarData(pedido.created_at)}</span>
                        <span className={`status-badge status-${pedido.status}`}>
                          <StatusIcon size={12} />
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>

                    {/* Itens */}
                    <div className="pedido-itens">
                      {pedido.itens?.map((item, index) => (
                        <div key={index} className="pedido-item">
                          <span className="item-descricao">
                            {item.quantidade} × {item.nome}
                          </span>
                          <span className="item-subtotal">
                            {formatarMoeda(item.preco * item.quantidade)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="pedido-total">
                      <span>Total</span>
                      <strong>{formatarMoeda(pedido.total)}</strong>
                    </div>

                    {/* OrderTracking - Rastreamento visual */}
                    <div className="tracking-wrapper">
                      <OrderTracking currentStatus={pedido.status} />
                    </div>

                    {/* Ações */}
                    <div className="pedido-actions">
                      {pedido.status === 'preparando' && (
                        <button 
                          className="action-btn cancelar"
                          onClick={() => cancelarPedido(pedido.id)}
                          disabled={acaoId === pedido.id}
                        >
                          <X size={14} />
                          {acaoId === pedido.id ? 'Cancelando...' : 'Cancelar pedido'}
                        </button>
                      )}
                      
                      {(pedido.status === 'cancelado' || pedido.status === 'entregue') && (
                        <button 
                          className="action-btn excluir"
                          onClick={() => excluirPedido(pedido.id)}
                          disabled={acaoId === pedido.id}
                        >
                          <Trash2 size={14} />
                          {acaoId === pedido.id ? 'Excluindo...' : 'Excluir'}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default MeusPedidos