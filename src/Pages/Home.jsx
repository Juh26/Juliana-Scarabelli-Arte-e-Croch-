import '../styles/Home.css'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-container">
      <div className="content-left">
        <h1 className="title">
          Ju Scarabelli
          <span className="subtitle">Arte & Crochê 🧶 </span>
        </h1>
        
        <div className="divider"></div>
        
        <p className="tagline">Feitos à mão em crochê</p>
        
        <p className="description">
          Cada peça de crochê é única, feita com cuidado e muito amor.<br />
          Perfeitas para decorar, presentear ou aquecer o coração.<br />
          De Muriaé para o mundo.
        </p>
        
        <button className="shop-button" onClick={() => navigate('/loja')}>
          Visitar Loja <span className="arrow">→</span>
        </button>
      </div>
    </div>
  )
}

export default Home  // <-- TAMBÉM DEVE TER ESSA LINHA!