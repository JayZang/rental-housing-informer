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
    console.log(this.props)
    return (
      <div className="user-logged-in-container">
        <div className="user-cover-container">
          <div className="cover-content">
            {this.props.userNickname}
          </div>
        </div>
      </div>
    )
  }
}

const mapStatesToProps = (state: RootState) => ({
  loggedIn: state.system.loggedIn,
  userNickname: state.system.userNickname
})

export default connect(mapStatesToProps)(UserCtrlMenu)