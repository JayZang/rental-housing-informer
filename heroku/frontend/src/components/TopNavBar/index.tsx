import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './TopNavBar.scss'
import UserCtrlMenu from '../UserCtrlMenu'

interface TopNavBarProps {
  title: string
}

class TopNavBar extends Component<TopNavBarProps> {
  render() {
    return (
      <div id="top-nav-bar">
        <div className="field left-field"></div>
        <div className="field middle-field">
          <div className="main-title">
            <Link to="/">{this.props.title}</Link>
          </div>
        </div>
        <div className="field right-field">
          <UserCtrlMenu />
        </div>
      </div>
    )
  }
}

export default TopNavBar