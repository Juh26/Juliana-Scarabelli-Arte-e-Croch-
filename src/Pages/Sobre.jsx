// src/Pages/Sobre.jsx
import { motion } from 'framer-motion'
import '../styles/Sobre.css'

function Sobre() {
  return (
    <div className="sobre-page">
      <div className="sobre-container">
        <motion.div
          className="sobre-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        > 
          {/* Grid 2 colunas */}
          <div className="sobre-grid">
            {/* Imagem do Ateliê - Esquerda */}
            <div className="sobre-imagem-wrapper">
              <div className="sobre-imagem">
                <img src="/atelie.jpeg" alt="Ateliê Juliana Scarabelli" className="sobre-imagem-img"/>
              </div>
            </div>
            {/* Conteúdo Textual - Direita */}
            <div className="sobre-texto-wrapper">
              <h1 className="sobre-titulo">Nossa História</h1>
              
              <div className="sobre-paragrafos">
                <p className="sobre-paragrafo">
                  A <strong>Juliana Scarabelli Crochê</strong> nasceu do amor pelo trabalho manual e pela tradição do crochê, passada de geração em geração na cidade de <strong>Muriaé, Minas Gerais</strong>.
                </p>

                <p className="sobre-paragrafo">
                  Cada peça é única, feita à mão com materiais selecionados — <strong>fios de algodão mercerizado, lãs acrílicas premium e barbantes ecológicos</strong>. Do primeiro ponto ao acabamento final, cada criação carrega a delicadeza e o cuidado de quem ama o que faz.
                </p>

                <p className="sobre-paragrafo">
                  Acreditamos que o crochê é mais do que artesanato — é <strong>arte, memória afetiva e aconchego</strong>. Nosso objetivo é levar essa sensação para a sua casa.
                </p>

                <p className="sobre-citacao">
                  "De Muriaé para o mundo, com muito carinho em cada ponto."
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Sobre