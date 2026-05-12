// src/Pages/Footer.jsx
import { Link } from 'react-router-dom'
import { MapPin, Mail, Phone, Heart } from 'lucide-react'
import Newsletter from '../components/Newsletter'
import '../styles/Footer.css'

function Footer() {
  const anoAtual = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Coluna 1 - Marca */}
        <div className="footer-col">
          <h3 className="footer-brand">Juliana Scarabelli Crochê</h3>
          <p className="footer-tagline">
            Peças artesanais feitas com amor e dedicação em cada ponto.
          </p>
        </div>

        {/* Coluna 2 - Navegação */}
        <div className="footer-col">
          <h4 className="footer-title">NAVEGAÇÃO</h4>
          <ul className="footer-links">
            <li><Link to="/loja">Loja</Link></li>
            <li><Link to="/sobre">Sobre</Link></li>
            <li><Link to="/contato">Contato</Link></li>
          </ul>
        </div>

        {/* Coluna 3 - Contato */}
        <div className="footer-col">
          <h4 className="footer-title">CONTATO</h4>
          <ul className="footer-contato">
            <li>
              <MapPin size={14} className="footer-icon" />
              <span>Muriaé, MG — Brasil</span>
            </li>
            <li>
              <Mail size={14} className="footer-icon" />
              <span>contato@julianascarabelli.com</span>
            </li>
            <li>
              <Phone size={14} className="footer-icon" />
              <span>(32) 99999-0000</span>
            </li>
          </ul>
        </div>

        {/* Coluna 4 - Newsletter */}
        <div className="footer-col">
          <h4 className="footer-title">NEWSLETTER</h4>
          <Newsletter />
        </div>
      </div>

      {/* Barra inferior - Copyright */}
      <div className="footer-bottom">
        <div className="footer-copyright">
          Feito com 
          <Heart size={12} className="footer-heart" />
          e muito crochê — © {anoAtual}
        </div>
      </div>
    </footer>
  )
}

export default Footer