// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, X, Sun, Moon, User, ShoppingBag, LogOut
} from 'lucide-react'
import { useAuth } from '../contexts/Authcontext'
import { useCart } from '../contexts/CartContext'
import '../styles/Navbar.css'

function Navbar() {
  const navigate = useNavigate()
  const { user, isAdmin, logout } = useAuth()
  const { cartCount } = useCart()
  const [menuAberto, setMenuAberto] = useState(false)
  const [temaEscuro, setTemaEscuro] = useState(false)

  const toggleTema = () => {
    setTemaEscuro(!temaEscuro)
    document.body.classList.toggle('dark')
  }

  const fecharMenu = () => {
    setMenuAberto(false)
  }

  const handleLogout = () => {
    logout()
    fecharMenu()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="logo" onClick={fecharMenu}>
          Juliana Scarabelli
        </Link>

        {/* Links Desktop */}
        <div className="nav-links-desktop">
          <Link to="/loja" className="nav-link">Loja</Link>
          <Link to="/sobre" className="nav-link">Sobre</Link>
          <Link to="/contato" className="nav-link">Contato</Link>
          
          {/* Dashboard - aparece APENAS para ADMIN */}
          {isAdmin && (
            <Link to="/admin" className="nav-link">Dashboard</Link>
          )}
        </div>

        {/* Ícones Desktop */}
        <div className="nav-actions-desktop">
          {/* Tema */}
          <button onClick={toggleTema} className="nav-icon-btn">
            {temaEscuro ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Carrinho com badge */}
          <button className="nav-icon-btn carrinho-btn" onClick={() => navigate('/carrinho')}>
            <ShoppingBag size={16} />
            {cartCount > 0 && (
              <span className="carrinho-badge">{cartCount}</span>
            )}
          </button>

          {/* Usuário */}
          {user ? (
            <div className="nav-usuario">
              <span className="usuario-nome">{user.nome}</span>
              <button onClick={handleLogout} className="nav-icon-btn logout-btn" title="Sair">
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="nav-link entrar-link">
              <User size={14} />
              <span>Entrar</span>
            </Link>
          )}
        </div>

        {/* Menu Mobile */}
        <button className="menu-mobile-btn" onClick={() => setMenuAberto(!menuAberto)}>
          {menuAberto ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Dropdown Mobile */}
      <AnimatePresence>
        {menuAberto && (
          <motion.div
            className="menu-mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="menu-mobile-links">
              <Link to="/loja" className="mobile-link" onClick={fecharMenu}>Loja</Link>
              <Link to="/sobre" className="mobile-link" onClick={fecharMenu}>Sobre</Link>
              <Link to="/contato" className="mobile-link" onClick={fecharMenu}>Contato</Link>
              
              {isAdmin && (
                <Link to="/admin" className="mobile-link" onClick={fecharMenu}>Dashboard</Link>
              )}
              
              <div className="mobile-divider"></div>
              
              <button className="mobile-link" onClick={() => { navigate('/carrinho'); fecharMenu(); }}>
                <ShoppingBag size={14} />
                <span>Carrinho</span>
                {cartCount > 0 && (
                  <span className="carrinho-badge-mobile">{cartCount}</span>
                )}
              </button>
              
              {user ? (
                <>
                  <button onClick={handleLogout} className="mobile-link mobile-logout">
                    <LogOut size={14} />
                    <span>Sair</span>
                  </button>
                  <span className="mobile-usuario">Olá, {user.nome}</span>
                </>
              ) : (
                <Link to="/login" className="mobile-link" onClick={fecharMenu}>
                  <User size={14} />
                  <span>Entrar</span>
                </Link>
              )}
              
              <div className="mobile-divider"></div>
              
              <div className="mobile-acoes">
                <button onClick={toggleTema} className="mobile-acao-btn">
                  {temaEscuro ? <Sun size={14} /> : <Moon size={14} />}
                  <span>{temaEscuro ? 'Modo claro' : 'Modo escuro'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar