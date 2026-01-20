import React from 'react'

const Logo = () => {
  return (
    <div>
      <svg width="260" height="80" viewBox="0 0 260 80" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#e0f2fe" />
          </linearGradient>
        </defs>

        <text
          x="10"
          y="55"
          fontSize="42"
          fontWeight="800"
          fill="url(#grad)"
          fontFamily="Poppins, sans-serif"
        >
          Quizक्रिडा
        </text>
      </svg>

    </div>
  )
}

export default Logo
