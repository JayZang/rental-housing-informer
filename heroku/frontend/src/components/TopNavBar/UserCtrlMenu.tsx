import React, { Component } from 'react'
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'
import { RootState } from '../../stores'
import { IUser } from '../../stores/system/types'
import * as systemStore from '../../stores/system'
import DefaultUserCoverImg from '../../assets/img/default-user-cover-img.png'
import './UserCtrlMenu.scss'

interface UserCtrlMenuProps extends RouteComponentProps {
  user: IUser
}

class UserCtrlMenu extends Component<UserCtrlMenuProps> {
  constructor(prop: any) {
    super(prop)

    this.handleLogoutClick = this.handleLogoutClick.bind(this)
  }
  render() {
    return (
      <div id="user-ctrl-menu">
        <Link className="user-ctrl-item user-info-container" to="/console/user">
          <div className="user-cover-img-container">
            <img src={DefaultUserCoverImg} alt=""/>
          </div>
          <div className="user-content-container">
            <div className="user-nickname">
              {this.props.user.nickname}
            </div>
            <div className="user-account">
              @{this.props.user.id}
            </div>
            <i className="fas fa-cog"></i>
          </div>
        </Link>
        <div className="user-ctrl-item user-logout-container" onClick={this.handleLogoutClick}>
          <i className="ti-power-off"></i> 登出
        </div>
      </div>
    )
  }

  handleLogoutClick() {
    systemStore.logout()
    this.props.history.push('/')
  }
}

const mapStateToProps = (state: RootState) => ({
  user: state.system.user
})

export default connect(mapStateToProps)(withRouter(UserCtrlMenu))