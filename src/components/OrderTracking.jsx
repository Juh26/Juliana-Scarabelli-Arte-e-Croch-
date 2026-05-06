import { CheckCircle, Package, Truck, Check } from 'lucide-react'

const steps = [
  { status: 'preparando', label: 'Preparando', icon: Package },
  { status: 'caminho', label: 'A caminho', icon: Truck },
  { status: 'entregue', label: 'Entregue', icon: Check }
]

function OrderTracking({ currentStatus }) {
  const currentIndex = steps.findIndex(step => step.status === currentStatus)

  return (
    <div className="order-tracking">
      {steps.map((step, index) => {
        const Icon = step.icon
        const isCompleted = index <= currentIndex
        const isActive = index === currentIndex
        
        return (
          <div key={step.status} className="tracking-step">
            <div className={`tracking-icon ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
              {isCompleted ? <CheckCircle size={20} /> : <Icon size={20} />}
            </div>
            <span className={`tracking-label ${isCompleted ? 'completed' : ''}`}>
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <div className={`tracking-line ${isCompleted ? 'completed' : ''}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default OrderTracking