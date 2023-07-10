import React from 'react'
import "./LoadingScreen.css"

const LoadingScreen = ({background}) => {
  return (
    <div className='loading-wrap' style={{backgroundColor: (background) ? background: "black"}}>
        <span className="loader"/>
    </div>
  )
}

export default LoadingScreen