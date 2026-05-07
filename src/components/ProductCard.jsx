// src/components/ProductCard.jsx
import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { toast } from 'sonner'

function ProductCard({ product }) {
  const { addItem } = useCart()

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
    toast.success(`${product.nome} adicionado ao carrinho!`)
  }

  // Verificar se é uma URL de imagem
  const temImagem = product.imagem && (
    product.imagem.startsWith('http') || 
    product.imagem.includes('supabase.co/storage')
  )

  return (
    <div className="produto-card">
      <Link to={`/produto/${product.id}`} className="produto-link">
        <div className="produto-imagem">
          {temImagem ? (
            <img 
              src={product.imagem} 
              alt={product.nome} 
              className="card-imagem"
            />
          ) : (
            <span className="card-emoji">🧶</span>
          )}
          {product.em_promocao && (
            <span className="promo-badge">PROMOÇÃO</span>
          )}
        </div>
        <div className="produto-info">
          <span className="produto-categoria">{product.categoria}</span>
          <h3 className="produto-nome">{product.nome}</h3>
          <div className="produto-preco">
            {product.em_promocao && product.preco_original ? (
              <>
                <span className="preco-original">R$ {product.preco_original.toFixed(2)}</span>
                <span className="preco-atual">R$ {product.preco.toFixed(2)}</span>
              </>
            ) : (
              <span className="preco-atual">R$ {product.preco.toFixed(2)}</span>
            )}
          </div>
          {product.estoque <= 3 && product.estoque > 0 && (
            <p className="estoque-baixo">Últimas {product.estoque} peças!</p>
          )}
        </div>
      </Link>
      <button 
        className="add-to-cart-btn-card"
        onClick={handleAddToCart}
      >
        <ShoppingBag size={16} />
        Adicionar
      </button>
    </div>
  )
}

export default ProductCard