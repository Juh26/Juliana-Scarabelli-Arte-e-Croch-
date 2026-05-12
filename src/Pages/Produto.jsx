// src/Pages/Produto.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ShoppingBag, Minus, Plus, Send } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/Authcontext'
import { supabase } from '../services/supabase'
import { toast, Toaster } from 'sonner'
import StarRating from '../components/StarRating'
import '../styles/Produto.css'

function Produto() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addItem } = useCart()
  
  const [produto, setProduto] = useState(null)
  const [avaliacoes, setAvaliacoes] = useState([])
  const [quantidade, setQuantidade] = useState(1)
  const [carregando, setCarregando] = useState(true)
  const [jaComprou, setJaComprou] = useState(false)
  const [jaAvaliou, setJaAvaliou] = useState(false)
  
  const [avaliacaoRating, setAvaliacaoRating] = useState(5)
  const [avaliacaoComentario, setAvaliacaoComentario] = useState('')
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    async function buscarProduto() {
      setCarregando(true)
      
      const { data: produtoData, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Erro ao buscar produto:', error)
        setCarregando(false)
        return
      }
      
      setProduto(produtoData)
      
      // Buscar avaliações
      const { data: avaliacoesData } = await supabase
        .from('avaliacoes')
        .select('*')
        .eq('produto_id', id)
        .order('created_at', { ascending: false })
      
      setAvaliacoes(avaliacoesData || [])
      
      // Se estiver logado, verificar se já comprou e já avaliou
      if (user) {
        // Verificar se já comprou este produto
        const { data: pedidosData } = await supabase
          .from('pedidos')
          .select('*')
          .eq('usuario_id', user.id)
          .neq('status', 'cancelado')
        
        let comprou = false
        if (pedidosData) {
          for (const pedido of pedidosData) {
            if (pedido.itens && pedido.itens.some(item => item.productId === parseInt(id))) {
              comprou = true
              break
            }
          }
        }
        setJaComprou(comprou)
        
        // Verificar se já avaliou
        const { data: avaliacaoExistente } = await supabase
          .from('avaliacoes')
          .select('*')
          .eq('produto_id', id)
          .eq('usuario_id', user.id)
          .maybeSingle()
        
        setJaAvaliou(!!avaliacaoExistente)
      }
      
      setCarregando(false)
    }
    
    buscarProduto()
  }, [id, user])

  const handleAddToCart = () => {
    if (!produto) return
    addItem(produto, quantidade)
    toast.success(`${quantidade}x ${produto.nome} adicionado ao carrinho!`)
  }

  const handleEnviarAvaliacao = async () => {
    if (!user) {
      toast.error('Faça login para avaliar')
      navigate('/login')
      return
    }
    
    if (!jaComprou) {
      toast.error('Você só pode avaliar produtos que já comprou')
      return
    }
    
    if (jaAvaliou) {
      toast.error('Você já avaliou este produto')
      return
    }
    
    if (!avaliacaoRating || avaliacaoRating < 1 || avaliacaoRating > 5) {
      toast.error('Selecione uma nota de 1 a 5 estrelas')
      return
    }
    
    setEnviando(true)
    
    try {
      // Salvar avaliação
      const { error } = await supabase
        .from('avaliacoes')
        .insert({
          produto_id: parseInt(id),
          usuario_id: user.id,
          usuario_nome: user.nome,
          rating: avaliacaoRating,
          comentario: avaliacaoComentario || null
        })
      
      if (error) {
        console.error('Erro ao salvar avaliação:', error)
        toast.error(`Erro: ${error.message}`)
        setEnviando(false)
        return
      }
      
      // Atualizar média do produto
      const { data: allAvaliacoes } = await supabase
        .from('avaliacoes')
        .select('rating')
        .eq('produto_id', parseInt(id))
      
      if (allAvaliacoes && allAvaliacoes.length > 0) {
        const soma = allAvaliacoes.reduce((acc, a) => acc + a.rating, 0)
        const media = soma / allAvaliacoes.length
        
        await supabase
          .from('produtos')
          .update({ 
            rating: parseFloat(media.toFixed(1)),
            num_avaliacoes: allAvaliacoes.length
          })
          .eq('id', parseInt(id))
      }
      
      toast.success('Avaliação enviada! Obrigado!')
      
      // Recarregar avaliações
      const { data: novasAvaliacoes } = await supabase
        .from('avaliacoes')
        .select('*')
        .eq('produto_id', id)
        .order('created_at', { ascending: false })
      
      setAvaliacoes(novasAvaliacoes || [])
      setJaAvaliou(true)
      setAvaliacaoComentario('')
      
    } catch (err) {
      console.error('Erro inesperado:', err)
      toast.error('Erro ao enviar avaliação')
    } finally {
      setEnviando(false)
    }
  }

  if (carregando) {
    return (
      <div className="produto-loading">
        <div className="spinner"></div>
        <p>Carregando produto...</p>
      </div>
    )
  }

  if (!produto) {
    return (
      <div className="produto-notfound">
        <h2>Produto não encontrado</h2>
        <button onClick={() => navigate('/loja')}>Voltar para loja</button>
      </div>
    )
  }

  return (
    <div className="produto-page">
      <Toaster position="top-right" richColors />
      
      <div className="produto-container">
        <button className="back-button" onClick={() => navigate('/loja')}>
          <ArrowLeft size={16} /> Voltar
        </button>

        <div className="produto-grid">
          {/* Imagem */}
          <div className="produto-imagem">
            {produto.imagem && (produto.imagem.startsWith('http') || produto.imagem.includes('supabase')) ? (
              <img src={produto.imagem} alt={produto.nome} className="imagem-real" />
            ) : (
              <span className="imagem-emoji">{produto.imagem || '🧶'}</span>
            )}
            {produto.em_promocao && (
              <span className="promo-badge">PROMOÇÃO</span>
            )}
          </div>

          {/* Informações */}
          <div className="produto-info">
            <span className="produto-categoria">{produto.categoria}</span>
            <h1 className="produto-nome">{produto.nome}</h1>
            
            <StarRating 
              rating={produto.rating || 0} 
              numAvaliacoes={produto.num_avaliacoes || 0}
              size={18}
            />
            
            <div className="produto-preco">
              {produto.em_promocao && produto.preco_original ? (
                <>
                  <span className="preco-original">R$ {produto.preco_original.toFixed(2)}</span>
                  <span className="preco-atual promo">R$ {produto.preco.toFixed(2)}</span>
                </>
              ) : (
                <span className="preco-atual">R$ {produto.preco.toFixed(2)}</span>
              )}
            </div>

            <p className="produto-descricao">{produto.descricao}</p>

            {produto.estoque <= 3 && produto.estoque > 0 && (
              <p className="estoque-baixo">⚠️ Últimas {produto.estoque} peças!</p>
            )}

            <div className="produto-quantidade">
              <label>Quantidade:</label>
              <div className="quantidade-control">
                <button onClick={() => setQuantidade(Math.max(1, quantidade - 1))}>-</button>
                <span>{quantidade}</span>
                <button onClick={() => setQuantidade(Math.min(produto.estoque, quantidade + 1))}>+</button>
              </div>
            </div>

            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              <ShoppingBag size={18} />
              Adicionar ao Carrinho
            </button>
          </div>
        </div>

        {/* SEÇÃO DE AVALIAÇÕES */}
        <div className="avaliacoes-section">
          <h3>Avaliações dos Clientes</h3>
          
          {avaliacoes.length === 0 ? (
            <p className="sem-avaliacoes">Ainda não há avaliações para este produto. Seja o primeiro a avaliar!</p>
          ) : (
            <div className="avaliacoes-lista">
              {avaliacoes.map(avaliacao => (
                <div key={avaliacao.id} className="avaliacao-card">
                  <div className="avaliacao-header">
                    <strong>{avaliacao.usuario_nome}</strong>
                    <StarRating rating={avaliacao.rating} size={14} />
                    <span className="avaliacao-data">
                      {new Date(avaliacao.created_at || avaliacao.data).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  {avaliacao.comentario && (
                    <p className="avaliacao-comentario">{avaliacao.comentario}</p>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {user && jaComprou && !jaAvaliou && (
            <div className="avaliacao-form">
              <h4>Deixe sua avaliação</h4>
              <div className="form-rating">
                <span>Sua nota:</span>
                <StarRating 
                  rating={avaliacaoRating} 
                  editable={true}
                  onRatingChange={setAvaliacaoRating}
                  size={24}
                />
              </div>
              <textarea
                placeholder="Escreva seu comentário (opcional)"
                value={avaliacaoComentario}
                onChange={(e) => setAvaliacaoComentario(e.target.value)}
                rows="3"
                className="avaliacao-textarea"
              />
              <button 
                onClick={handleEnviarAvaliacao}
                disabled={enviando}
                className="enviar-avaliacao-btn"
              >
                {enviando ? 'Enviando...' : <><Send size={14} /> Enviar avaliação</>}
              </button>
            </div>
          )}
          
          {user && !jaComprou && (
            <p className="avaliacao-mensagem">
              Compre este produto para deixar sua avaliação ✨
            </p>
          )}
          
          {user && jaAvaliou && (
            <p className="avaliacao-mensagem sucesso">
              ✅ Obrigado pela sua avaliação!
            </p>
          )}
          
          {!user && (
            <p className="avaliacao-mensagem">
              <button onClick={() => navigate('/login')} className="login-link-avaliacao">
                Faça login
              </button> para avaliar este produto
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Produto