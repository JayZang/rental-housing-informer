import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import './UserCtrlMenu.scss'
import { RootState } from '../../stores'

interface UserCtrlMenuProps {
  loggedIn: boolean
  userNickname: string
}

class UserCtrlMenu extends Component<UserCtrlMenuProps> {
  render() {
    return (
      <div id="user-ctrl-menu" className="user-ctrl-menu-container">
        {!this.props.loggedIn ? 
          this.renderNonLoggedIn(): 
          this.renderLoggedIn()}
      </div>
    )
  }

  renderNonLoggedIn() {
    return (
      <Link to="/login" className="user-default-container">
        <i className="fas fa-user"></i>
        <div className="user-default-text">登入</div>
      </Link>
    )
  }

  renderLoggedIn() {
    return (
      <div>123</div>
    )
  }
}

const mapStatesToProps = (state: RootState) => ({
  loggedIn: state.system.loggedIn,
  userNickname: state.system.userNickname
})

export default connect(mapStatesToProps)(UserCtrlMenu)