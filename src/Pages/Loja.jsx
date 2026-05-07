// src/Pages/Loja.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabase'
import '../styles/Loja.css'

function Loja() {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos')

  useEffect(() => {
    async function buscarProdutos() {
      setCarregando(true)
      
      let query = supabase.from('produtos').select('*')
      
      if (categoriaAtiva !== 'Todos') {
        query = query.eq('categoria', categoriaAtiva)
      }
      
      const { data, error } = await query
      
      if (error) {
        console.error('Erro ao buscar produtos:', error)
      } else {
        setProdutos(data)
      }
      
      setCarregando(false)
    }
    
    buscarProdutos()
  }, [categoriaAtiva])

  const categorias = ['Todos', 'Decoração', 'Chaveiros', 'Bolsas', 'Vestuário']

  if (carregando) {
    return (
      <div className="loja-loading">
        <div className="spinner"></div>
        <p>Carregando produtos...</p>
      </div>
    )
  }

  return (
    <div className="loja-page">
      <div className="loja-container">
        <h1 className="loja-title">Nossa Loja</h1>
        <p className="loja-subtitle">Peças únicas feitas à mão com carinho</p>

        {/* Filtros */}
        <div className="filtros">
          {categorias.map(cat => (
            <button
              key={cat}
              className={`filtro-btn ${categoriaAtiva === cat ? 'active' : ''}`}
              onClick={() => setCategoriaAtiva(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid de Produtos */}
        <div className="produtos-grid">
          {produtos.map(produto => {
            // Verificar se tem imagem URL
            const imagemUrl = produto.imagem && produto.imagem.startsWith('http') 
              ? produto.imagem 
              : null

            return (
              <Link to={`/produto/${produto.id}`} key={produto.id} className="produto-card">
                <div className="produto-imagem">
                  {imagemUrl ? (
                    <img 
                      src={imagemUrl} 
                      alt={produto.nome} 
                      className="card-imagem"
                    />
                  ) : (
                    <span className="card-emoji">{produto.imagem || '🧶'}</span>
                  )}
                  {produto.em_promocao && (
                    <span className="promo-badge">PROMOÇÃO</span>
                  )}
                </div>
                <div className="produto-info">
                  <span className="produto-categoria">{produto.categoria}</span>
                  <h3 className="produto-nome">{produto.nome}</h3>
                  <div className="produto-preco">
                    {produto.em_promocao && produto.preco_original ? (
                      <>
                        <span className="preco-original">R$ {produto.preco_original.toFixed(2)}</span>
                        <span className="preco-atual">R$ {produto.preco.toFixed(2)}</span>
                      </>
                    ) : (
                      <span className="preco-atual">R$ {produto.preco.toFixed(2)}</span>
                    )}
                  </div>
                  {produto.estoque <= 3 && produto.estoque > 0 && (
                    <p className="estoque-baixo">Últimas {produto.estoque} peças!</p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        {produtos.length === 0 && (
          <div className="nenhum-produto">
            <p>Nenhum produto encontrado nesta categoria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Loja