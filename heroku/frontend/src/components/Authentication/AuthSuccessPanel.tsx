import React, { Component } from 'react'
import linePic from '../../assets/img/line.png'

interface AuthSuccessPanelProps {
  authKey: string
}

class AuthSuccessPanel extends Component<AuthSuccessPanelProps> {
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
          <pre className="auth-success-panel-key">
            {this.props.authKey}
          </pre>
        </div>
      </div>
    )
  }
}

export default AuthSuccessPanel