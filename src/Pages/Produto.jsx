// src/Pages/Produto.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ShoppingBag, Minus, Plus, Star } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { supabase } from '../services/supabase'
import { toast } from 'sonner'
import '../styles/Produto.css'

function Produto() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const [produto, setProduto] = useState(null)
  const [avaliacoes, setAvaliacoes] = useState([])
  const [quantidade, setQuantidade] = useState(1)
  const [carregando, setCarregando] = useState(true)

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
      
      console.log('Produto carregado:', produtoData)
      console.log('URL da imagem:', produtoData.imagem)
      
      setProduto(produtoData)
      
      const { data: avaliacoesData } = await supabase
        .from('avaliacoes')
        .select('*')
        .eq('produto_id', id)
      
      setAvaliacoes(avaliacoesData || [])
      setCarregando(false)
    }
    
    buscarProduto()
  }, [id])

  const handleAddToCart = () => {
    if (!produto) return
    addItem(produto, quantidade)
    toast.success(`${quantidade}x ${produto.nome} adicionado ao carrinho!`)
  }

  const incrementarQuantidade = () => {
    if (quantidade < produto?.estoque) {
      setQuantidade(quantidade + 1)
    } else {
      toast.warning(`Estoque máximo: ${produto?.estoque} peças`)
    }
  }

  const decrementarQuantidade = () => {
    if (quantidade > 1) {
      setQuantidade(quantidade - 1)
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

  // Verificar se a imagem é uma URL válida
  const imagemUrl = produto.imagem && (produto.imagem.startsWith('http') || produto.imagem.startsWith('https')) 
    ? produto.imagem 
    : null

  return (
    <div className="produto-page">
      <div className="produto-container">
        <button className="back-button" onClick={() => navigate('/loja')}>
          <ArrowLeft size={16} /> Voltar
        </button>

        <div className="produto-grid">
          {/* Imagem do Produto */}
          <div className="produto-imagem">
            {imagemUrl ? (
              <img 
                src={imagemUrl} 
                alt={produto.nome} 
                className="imagem-real"
                onError={(e) => {
                  console.error('Erro ao carregar imagem:', imagemUrl)
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
            ) : null}
            <div className="imagem-emoji" style={{ display: imagemUrl ? 'none' : 'flex' }}>
              <span>{produto.imagem === imagemUrl ? '🧶' : (produto.imagem || '🧶')}</span>
            </div>
            {produto.em_promocao && (
              <span className="promo-badge">PROMOÇÃO</span>
            )}
          </div>

          {/* Informações do Produto */}
          <div className="produto-info">
            <span className="produto-categoria">{produto.categoria}</span>
            <h1 className="produto-nome">{produto.nome}</h1>
            
            <div className="produto-rating">
              <div className="stars">
                {[1,2,3,4,5].map(star => (
                  <Star 
                    key={star} 
                    size={16} 
                    className={star <= (produto.rating || 0) ? 'star-filled' : 'star-empty'} 
                  />
                ))}
              </div>
              <span>({produto.num_avaliacoes || 0} avaliações)</span>
            </div>

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
                <button onClick={decrementarQuantidade}>-</button>
                <span>{quantidade}</span>
                <button onClick={incrementarQuantidade}>+</button>
              </div>
            </div>

            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              <ShoppingBag size={18} />
              Adicionar ao Carrinho
            </button>
          </div>
        </div>

        {/* Avaliações */}
        {avaliacoes.length > 0 && (
          <div className="avaliacoes-section">
            <h3>Avaliações dos Clientes</h3>
            {avaliacoes.map(avaliacao => (
              <div key={avaliacao.id} className="avaliacao-card">
                <div className="avaliacao-header">
                  <strong>{avaliacao.usuario_nome}</strong>
                  <div className="avaliacao-stars">
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} size={12} className={star <= avaliacao.rating ? 'star-filled' : 'star-empty'} />
                    ))}
                  </div>
                </div>
                <p>{avaliacao.comentario}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Produto