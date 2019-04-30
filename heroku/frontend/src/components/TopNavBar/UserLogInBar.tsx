import React, { Component, MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import './UserLogInBar.scss'
import DefaultUserCoverImg from '../../assets/img/default-user-cover-img.png'
import { RootState } from '../../stores'
import UserCtrlMenu from './UserCtrlMenu'

interface UserLogInBarProps {
  loggedIn: boolean
  userNickName: string
}

interface UserLogInBarStates {
  isShowCtrlMenu: boolean
}

class UserLogInBar extends Component<UserLogInBarProps, UserLogInBarStates> {
  constructor(props: any) {
    super(props)

    this.handleUserCoverImgClick = this.handleUserCoverImgClick.bind(this)
    this.handleRootDomClick = this.handleRootDomClick.bind(this)
    this.handleUserCtrlCLick = this.handleUserCtrlCLick.bind(this)

    this.state = {
      isShowCtrlMenu: false
    }
  }
  render() {
    return (
      <div id="user-login-bar" className="user-ctrl-menu-container" onClick={this.handleRootDomClick}>
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
      <div className="user-logged-in-container">
        <div className="user-cover-container" onClick={this.handleUserCoverImgClick}>
          <div className="cover-content">
            <img src={DefaultUserCoverImg} alt=""/>
            <span className="cover-user-name">{this.props.userNickName}</span>
          </div>
        </div>
        <div 
          className={`user-ctrl-container ${this.state.isShowCtrlMenu ? ' show': ''}`} 
          onClick={this.handleUserCtrlCLick}>
          <UserCtrlMenu />
        </div>
      </div>
    )
  }

  componentDidMount() {
    document.addEventListener('click', () => {
      this.setState({ isShowCtrlMenu: false })
    })
  }

  handleRootDomClick(event: MouseEvent<HTMLDivElement>) {
    event.nativeEvent.stopImmediatePropagation()
  }

  handleUserCoverImgClick() {
    const isShow = this.state.isShowCtrlMenu
    this.setState({ isShowCtrlMenu: !isShow })
  }

  handleUserCtrlCLick() {
    this.setState({ isShowCtrlMenu: false })
  }
}

const mapStatesToProps = (state: RootState) => ({
  loggedIn: state.system.loggedIn,
  userNickName: state.system.user.nickname
})

export default connect(mapStatesToProps)(UserLogInBar)