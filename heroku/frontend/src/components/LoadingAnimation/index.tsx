import React, { Component } from 'react'
import './LoadingAnimation.scss'

class LoadingAnimation extends Component {
  render() {
    return (
      <div className="cube-animation-container">
        <div className="cube1"></div>
        <div className="cube2"></div>
      </div>
    )
  }
}

export default LoadingAnimation