import React, { Component } from 'react'
import { Link, Route } from 'react-router-dom'
import './TopNavBar.scss'
import UserLogInBar from './UserLogInBar'
import ConsoleSideBarController from '../ConsoleTable/LeftSideBar/Controller'

interface TopNavBarProps {
  title: string
}

class TopNavBar extends Component<TopNavBarProps> {
  render() {
    return (
      <div id="top-nav-bar">
        <div className="field left-field">
          <Route path="/console" component={ConsoleSideBarController} />
        </div>
        <div className="field middle-field">
          <div className="main-title">
            <Link to="/">{this.props.title}</Link>
          </div>
        </div>
        <div className="field right-field">
          <UserLogInBar />
        </div>
      </div>
    )
  }
}

export default TopNavBar