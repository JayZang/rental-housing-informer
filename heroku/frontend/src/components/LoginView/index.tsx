import React, { Component } from 'react'
import LoginPanel from './LoginPanel'
import './LoginView.scss'

class LoginView extends Component {
  render() {
    return (
      <div id="loginView">
        <div className="left-container"></div>
        <div className="right-container">
          <LoginPanel />
        </div>
      </div>
    )
  }
}

export default LoginView