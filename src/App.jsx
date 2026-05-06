// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import Navbar from './components/Navbar'
import Footer from './Pages/Footer'
import Home from './Pages/Home'
import Loja from './Pages/Loja'
import Produto from './Pages/Produto'
import Carrinho from './Pages/Carrinho'
import Checkout from './Pages/Checkout'
import PedidoConfirmado from './Pages/PedidoConfirmado'
import Sobre from './Pages/Sobre'
import Contato from './Pages/Contato'
import Login from './Pages/Login'
import Cadastro from './Pages/Cadastro'
import Admin from './Pages/Admin'
import AdminRoute from './components/AdminRoute'
import './styles/App.css'
import './styles/Navbar.css'
import './styles/Footer.css'

function App() {
  return (
    <div className="app-wrapper">
      <Toaster position="top-right" richColors />
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Páginas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/loja" element={<Loja />} />
          <Route path="/produto/:id" element={<Produto />} />
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/contato" element={<Contato />} />
          
          {/* Autenticação */}
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          
          {/* Checkout (requer login) */}
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pedido-confirmado" element={<PedidoConfirmado />} />
          
          {/* Admin (protegido) */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App