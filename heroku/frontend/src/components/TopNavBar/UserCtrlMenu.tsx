import React, { Component } from 'react'
import { connect } from 'react-redux'
import { RootState } from '../../stores'
import { IUser } from '../../stores/system/types'
import * as systemStore from '../../stores/system'
import DefaultUserCoverImg from '../../assets/img/default-user-cover-img.png'
import './UserCtrlMenu.scss'

interface UserCtrlMenuProps {
  user: IUser
}

class UserCtrlMenu extends Component<UserCtrlMenuProps> {
  render() {
    return (
      <div id="user-ctrl-menu">
        <div className="user-ctrl-item user-info-container">
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
        </div>
        <div className="user-ctrl-item user-logout-container" onClick={systemStore.logout}>
          登出
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  user: state.system.user
})

export default connect(mapStateToProps)(UserCtrlMenu)