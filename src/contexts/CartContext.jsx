// src/contexts/CartContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'sonner'

const CartContext = createContext({})

export function useCart() {
  return useContext(CartContext)
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [cupom, setCupom] = useState(null)
  const [descontoPercent, setDescontoPercent] = useState(0)

  // Carregar carrinho do localStorage ao iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('jsc_cart')
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart)
        if (Array.isArray(parsed)) {
          setCartItems(parsed)
        }
      } catch (e) {
        console.error('Erro ao carregar carrinho:', e)
      }
    }
  }, [])

  // Salvar carrinho no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('jsc_cart', JSON.stringify(cartItems))
  }, [cartItems])

  // Adicionar item ao carrinho
  const addItem = (product, quantity = 1) => {
    if (!product || !product.id) {
      console.error('Produto inválido:', product)
      return
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === product.id)
      
      if (existingItem) {
        const newQuantity = existingItem.quantidade + quantity
        
        if (newQuantity > product.estoque) {
          toast.warning(`Estoque insuficiente. Temos apenas ${product.estoque} peças.`)
          return prevItems
        }
        
        toast.success(`${product.nome} - quantidade atualizada para ${newQuantity}!`)
        return prevItems.map(item =>
          item.productId === product.id
            ? { ...item, quantidade: newQuantity }
            : item
        )
      } else {
        if (quantity > product.estoque) {
          toast.warning(`Estoque insuficiente. Temos apenas ${product.estoque} peças.`)
          return prevItems
        }
        
        toast.success(`🎉 ${product.nome} adicionado ao carrinho!`)
        return [...prevItems, {
          productId: product.id,
          nome: product.nome,
          preco: product.preco,
          imagem: product.imagem || '🧶',
          quantidade: quantity,
          estoque: product.estoque
        }]
      }
    })
  }

  // Remover item do carrinho
  const removeItem = (productId) => {
    setCartItems(prevItems => {
      const item = prevItems.find(i => i.productId === productId)
      if (item) {
        toast.info(`${item.nome} removido do carrinho`)
      }
      return prevItems.filter(item => item.productId !== productId)
    })
  }

  // Atualizar quantidade de um item
  const updateQuantity = (productId, quantidade) => {
    if (quantidade <= 0) {
      removeItem(productId)
      return
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId ? { ...item, quantidade } : item
      )
    )
  }

  // Limpar carrinho completamente
  const clearCart = () => {
    setCartItems([])
    setCupom(null)
    setDescontoPercent(0)
    localStorage.removeItem('jsc_cart')
    toast.info('Carrinho esvaziado')
  }

  // Aplicar cupom de desconto
  const applyCupom = (codigo) => {
    const cupomValido = codigo.toUpperCase() === 'PRIMEIRA10'
    
    if (cupomValido) {
      setCupom(codigo.toUpperCase())
      setDescontoPercent(10)
      toast.success('Cupom PRIMEIRA10 aplicado! 10% de desconto')
      return true
    } else {
      toast.error('Cupom inválido')
      return false
    }
  }

  // Remover cupom
  const removeCupom = () => {
    setCupom(null)
    setDescontoPercent(0)
    toast.info('Cupom removido')
  }

  // Calcular subtotal (soma de todos os itens)
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.preco * item.quantidade),
    0
  )

  // Calcular valor do desconto
  const desconto = (subtotal * descontoPercent) / 100

  // Calcular total final
  const total = subtotal - desconto

  // Calcular quantidade total de itens no carrinho
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantidade, 0)

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      subtotal,
      desconto,
      total,
      descontoPercent,
      cupom,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      applyCupom,
      removeCupom
    }}>
      {children}
    </CartContext.Provider>
  )
}