import React, { Component } from 'react'
import copy from 'copy-to-clipboard'
import linePic from '../../assets/img/line.png'

interface AuthSuccessPanelProps {
  authKey: string
}

class AuthSuccessPanel extends Component<AuthSuccessPanelProps> {
  constructor(props: AuthSuccessPanelProps) {
    super(props)

    this.handleKeyPanelClick = this.handleKeyPanelClick.bind(this)
  }

  render() {
    return (
      <div className="auth-success-panel-container">
        <div className="auth-success-panel-header">
          <div className="auth-success-panel-line-img">
            <img src={linePic} alt="" />
          </div>
          <div className="auth-success-panel-title">
            請至租屋小幫手 Line 機器人聊天室回覆以下代碼 <br/>
            回覆後即完成用戶註冊及認證
          </div>
        </div>
        <div className="auth-success-panel-content">
          <div className="auth-success-key-container">
            <button type="button" className="btn btn-secondary">複製</button>
            <pre className="auth-success-panel-key" onClick={this.handleKeyPanelClick}>
              {this.props.authKey}
            </pre>
          </div>
        </div>
      </div>
    )
  }

  handleKeyPanelClick() {
    const authKey = this.props.authKey
    copy(authKey)
  }
}

export default AuthSuccessPanel