import { useNavigate } from 'react-router-dom'
import '../styles/Sobre.css'

function Sobre() {
  const navigate = useNavigate()

  return (
    <div className="sobre-container">
      {/* Conteúdo da página Sobre */}
      <div className="sobre-content">
        <div className="sobre-grid">
          
          <div className="sobre-imagem">
            <img 
              src="/atelie.jpeg" 
              alt="Ateliê Juliana Scarabelli"
              className="imagem-real"
            />
          </div>
        
          <div className="sobre-texto">
            <h1 className="sobre-titulo">Nossa História</h1>
            <div className="sobre-descricao">
              <p>
                A <strong>Juliana Scarabelli Crochê</strong> nasceu do amor pelo trabalho manual e pela tradição do crochê, passada de geração em geração na cidade de Muriaé, Minas Gerais.
              </p>
              <p>
                Cada peça é única, feita à mão com materiais selecionados — fios de algodão mercerizado, lãs acrílicas premium e barbantes ecológicos. Do primeiro ponto ao acabamento final, cada criação carrega a delicadeza e o cuidado de quem ama o que faz.
              </p>
              <p>
                Acreditamos que o crochê é mais do que artesanato — é arte, é memória afetiva, é aconchego transformado em fio e cor. Nosso objetivo é levar essa sensação para a sua casa.
              </p>
              <p className="sobre-destaque">
                De Muriaé para o mundo, com muito carinho em cada ponto.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Botão voltar */}
      <button className="back-button" onClick={() => navigate('/')}>
        ← Voltar
      </button>
    </div>
  )
}

export default Sobre