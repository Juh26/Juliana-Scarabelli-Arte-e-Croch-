// src/Pages/Admin.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Package, Clock, DollarSign, Users, Plus, 
  Pencil, Trash2, Search, X
} from 'lucide-react'
import { supabase } from '../services/supabase'
import { useAuth } from '../contexts/Authcontext'
import { toast } from 'sonner'
import '../styles/Admin.css'

function Admin() {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  // Estados
  const [produtos, setProdutos] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [buscaProduto, setBuscaProduto] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState('')
  const [produtoEditando, setProdutoEditando] = useState(null)
  const [showModal, setShowModal] = useState(false)

  // Estatísticas
  const [stats, setStats] = useState({
    totalProdutos: 0,
    pedidosPendentes: 0,
    totalVendas: 0,
    totalClientes: 0
  })

  // Carregar dados
  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    setLoading(true)
    
    // Buscar produtos
    const { data: produtosData } = await supabase.from('produtos').select('*')
    setProdutos(produtosData || [])
    
    // Buscar pedidos (apenas não cancelados)
    const { data: pedidosData } = await supabase
      .from('pedidos')
      .select('*')
      .neq('status', 'cancelado')
      .order('created_at', { ascending: false })
    setPedidos(pedidosData || [])
    
    // Buscar clientes (apenas role = 'user')
    const { data: clientesData } = await supabase
      .from('perfis')
      .select('*')
      .eq('role', 'user')
    setClientes(clientesData || [])
    
    // Calcular estatísticas
    const totalProdutos = produtosData?.length || 0
    const pedidosPendentes = pedidosData?.filter(p => p.status === 'preparando').length || 0
    const totalVendas = pedidosData?.reduce((sum, p) => sum + (p.total || 0), 0) || 0
    const totalClientes = clientesData?.length || 0
    
    setStats({ totalProdutos, pedidosPendentes, totalVendas, totalClientes })
    setLoading(false)
  }

  // Excluir produto
  const handleDeleteProduto = async (id, nome) => {
    if (window.confirm(`Tem certeza que deseja excluir "${nome}"?`)) {
      const { error } = await supabase.from('produtos').delete().eq('id', id)
      if (error) {
        toast.error('Erro ao excluir produto')
      } else {
        toast.success('Produto excluído com sucesso!')
        carregarDados()
      }
    }
  }

  // Atualizar status do pedido
  const handleStatusChange = async (pedidoId, novoStatus) => {
    const { error } = await supabase
      .from('pedidos')
      .update({ status: novoStatus })
      .eq('id', pedidoId)
    
    if (error) {
      toast.error('Erro ao atualizar status')
    } else {
      toast.success(`Status atualizado para ${novoStatus}`)
      carregarDados()
    }
  }

  // Cancelar pedido
  const handleCancelarPedido = async (pedidoId) => {
    if (window.confirm('Tem certeza que deseja cancelar este pedido?')) {
      const { error } = await supabase
        .from('pedidos')
        .update({ status: 'cancelado' })
        .eq('id', pedidoId)
      
      if (error) {
        toast.error('Erro ao cancelar pedido')
      } else {
        toast.success('Pedido cancelado!')
        carregarDados()
      }
    }
  }

  // Verificar se a imagem é uma URL válida
  const temImagem = (imagem) => {
    return imagem && (imagem.startsWith('http') || imagem.includes('supabase.co/storage'))
  }

  // Filtrar produtos
  const produtosFiltrados = produtos.filter(produto => {
    const matchBusca = produto.nome.toLowerCase().includes(buscaProduto.toLowerCase())
    const matchCategoria = !categoriaFiltro || produto.categoria === categoriaFiltro
    return matchBusca && matchCategoria
  })

  // ✅ CATEGORIAS ATUALIZADAS - ALTERADO AQUI!
  const categorias = ['Todos', 'Decoração', 'Chaveiros', 'Bolsas', 'Vestuário']

  // Formatar data
  const formatarData = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Carregando dashboard...</p>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Olá, {user?.nome || 'Admin'} 👋</h1>
            <p className="admin-subtitle">Painel Administrativo</p>
          </div>
          <button 
            className="add-product-btn"
            onClick={() => navigate('/admin/produto/novo')}
          >
            <Plus size={16} />
            Adicionar Produto
          </button>
        </div>

        {/* Cards de Estatísticas */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon package">
              <Package size={24} />
            </div>
            <div className="stat-info">
              <h3>Total de Produtos</h3>
              <p className="stat-value">{stats.totalProdutos}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon clock">
              <Clock size={24} />
            </div>
            <div className="stat-info">
              <h3>Pedidos Pendentes</h3>
              <p className="stat-value">{stats.pedidosPendentes}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon dollar">
              <DollarSign size={24} />
            </div>
            <div className="stat-info">
              <h3>Total de Vendas</h3>
              <p className="stat-value">R$ {stats.totalVendas.toFixed(2)}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon users">
              <Users size={24} />
            </div>
            <div className="stat-info">
              <h3>Clientes Cadastrados</h3>
              <p className="stat-value">{stats.totalClientes}</p>
            </div>
          </div>
        </div>

        {/* Seção: Gerenciar Produtos */}
        <div className="admin-section">
          <h2 className="section-title">Gerenciar Produtos</h2>
          
          <div className="search-filters">
            <div className="search-input-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Buscar produto..."
                value={buscaProduto}
                onChange={(e) => setBuscaProduto(e.target.value)}
                className="search-input"
              />
              {buscaProduto && (
                <button className="clear-search" onClick={() => setBuscaProduto('')}>
                  <X size={14} />
                </button>
              )}
            </div>
            <select 
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="category-filter"
            >
              <option value="">Todas categorias</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Imagem</th>
                  <th>Nome</th>
                  <th>Categoria</th>
                  <th>Preço</th>
                  <th>Estoque</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtosFiltrados.map(produto => (
                  <tr key={produto.id}>
                    <td>
                      <div className="product-thumb">
                        {temImagem(produto.imagem) ? (
                          <img 
                            src={produto.imagem} 
                            alt={produto.nome} 
                            className="product-thumb-img"
                          />
                        ) : (
                          <span className="product-thumb-emoji">🧶</span>
                        )}
                      </div>
                    </td>
                    <td>{produto.nome}</td>
                    <td>{produto.categoria}</td>
                    <td>R$ {produto.preco?.toFixed(2)}</td>
                    <td>
                      {produto.estoque}
                      {produto.estoque <= 3 && (
                        <span className="low-stock-badge"> Baixo estoque</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="edit-btn"
                          onClick={() => navigate(`/admin/produto/${produto.id}`)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteProduto(produto.id, produto.nome)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {produtosFiltrados.length === 0 && (
              <p className="no-results">Nenhum produto encontrado</p>
            )}
          </div>
        </div>

        {/* Seção: Pedidos Recentes */}
        <div className="admin-section">
          <h2 className="section-title">Pedidos Recentes</h2>
          
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Data</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map(pedido => (
                  <tr key={pedido.id}>
                    <td>#{pedido.id}</td>
                    <td>{pedido.usuario_nome}</td>
                    <td>{formatarData(pedido.created_at)}</td>
                    <td>R$ {(pedido.total || 0).toFixed(2)}</td>
                    <td>
                      <span className={`status-badge status-${pedido.status}`}>
                        {pedido.status === 'preparando' ? 'Preparando' :
                         pedido.status === 'caminho' ? 'A caminho' : 'Entregue'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <select
                          value={pedido.status}
                          onChange={(e) => handleStatusChange(pedido.id, e.target.value)}
                          className="status-select"
                        >
                          <option value="preparando">Preparando</option>
                          <option value="caminho">A caminho</option>
                          <option value="entregue">Entregue</option>
                        </select>
                        {pedido.status !== 'entregue' && (
                          <button 
                            className="cancel-order-btn"
                            onClick={() => handleCancelarPedido(pedido.id)}
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pedidos.length === 0 && (
              <p className="no-results">Nenhum pedido encontrado</p>
            )}
          </div>
        </div>

        {/* Seção: Clientes Cadastrados */}
        <div className="admin-section">
          <h2 className="section-title">Clientes Cadastrados</h2>
          
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Data de cadastro</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map(cliente => (
                  <tr key={cliente.id}>
                    <td>{cliente.nome}</td>
                    <td>{cliente.email}</td>
                    <td>{formatarData(cliente.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {clientes.length === 0 && (
              <p className="no-results">Nenhum cliente encontrado</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin