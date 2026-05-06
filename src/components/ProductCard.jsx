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
    
    // Feedback visual
    toast.success(`${product.nome} adicionado ao carrinho!`)
  }

  return (
    <div className="produto-card">
      <Link to={`/produto/${product.id}`} className="produto-link">
        <div className="produto-imagem">
          <span>{product.imagem || '🧶'}</span>
          {product.em_promocao && (
            <span className="promo-badge">PROMOÇÃO</span>
          )}
        </div>
        <div className="produto-info">
          <span className="produto-categoria">{product.categoria}</span>
          <h3 className="produto-nome">{product.nome}</h3>
          <div className="produto-rating">
            <span>⭐</span>
            <span>{product.rating}</span>
            <span>({product.num_avaliacoes})</span>
          </div>
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
        Adicionar ao Carrinho
      </button>
    </div>
  )
}

export default ProductCard