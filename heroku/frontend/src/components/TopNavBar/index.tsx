import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './TopNavBar.scss'

class TopNavBar extends Component {
  render() {
    return (
      <div id="top-nav-bar">
        <div className="main-title">
          <Link to="/">租屋小幫手</Link>
        </div>
      </div>
    )
  }
}

export default TopNavBar