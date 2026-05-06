// src/components/AdminRoute.jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/Authcontext'

function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth()

  // Enquanto carrega, mostra loading
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div className="spinner" style={{ 
          width: '2rem', 
          height: '2rem', 
          border: '3px solid #e8dfd3', 
          borderTopColor: '#6b8c5c', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite' 
        }}></div>
        <p>Carregando...</p>
      </div>
    )
  }

  // Se não tem usuário OU não é admin, redireciona para login
  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />
  }

  // Se é admin, mostra o conteúdo
  return children
}

export default AdminRoute