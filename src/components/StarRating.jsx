// src/components/StarRating.jsx
import { useState } from 'react'
import { Star } from 'lucide-react'

function StarRating({ rating, numAvaliacoes, editable = false, onRatingChange = null, size = 16 }) {
  const [hoverRating, setHoverRating] = useState(editable ? 0 : null)
  const [currentRating, setCurrentRating] = useState(rating)

  const handleMouseEnter = (star) => {
    if (editable) setHoverRating(star)
  }

  const handleMouseLeave = () => {
    if (editable) setHoverRating(0)
  }

  const handleClick = (star) => {
    if (editable && onRatingChange) {
      setCurrentRating(star)
      onRatingChange(star)
    }
  }

  const displayRating = editable ? (hoverRating || currentRating) : rating

  return (
    <div className="star-rating" style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            style={{
              cursor: editable ? 'pointer' : 'default',
              fill: star <= displayRating ? '#f5a623' : 'none',
              color: star <= displayRating ? '#f5a623' : '#e8dfd3',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(star)}
          />
        ))}
      </div>
      {numAvaliacoes !== undefined && (
        <span style={{ fontSize: '0.7rem', marginLeft: '0.5rem', color: '#8b6f4e' }}>
          ({numAvaliacoes} avaliações)
        </span>
      )}
    </div>
  )
}

export default StarRating