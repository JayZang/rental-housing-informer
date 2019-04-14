import React, { Component, ChangeEvent } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import './LoginPanel.scss'
import * as systemStore from '../../stores/system'
import { RootState } from '../../stores'

interface LoginPanelProps {
  loggedIn: boolean
}

interface LoginPanelStates {
  formField: {
    account: string
    password: string
  }
  fieldErrMsg: {
    account: string
    password: string
    [key: string]: string
  },
  errMsg: string
}

class LoginPanel extends Component<LoginPanelProps, LoginPanelStates> {
  constructor(props: any) {
    super(props)

    this.handleAccountFieldChange = this.handleAccountFieldChange.bind(this)
    this.handlePasswordFieldChange = this.handlePasswordFieldChange.bind(this)
    this.handleLoginSubmitBtnClick = this.handleLoginSubmitBtnClick.bind(this)

    this.state = {
      formField: {
        account: '',
        password: ''
      },
      fieldErrMsg: {
        account: '',
        password: ''
      },
      errMsg: ''
    }
  }

  render() {
    if (this.props.loggedIn)
      return <Redirect to="/"/>

    return (
      <div id="login-panel" className="login-panel-container">
        <div className="login-panel-title">
          <i className="fas fa-user"></i>
          <span>用戶登入</span>
        </div>
        <hr className="title-separator-hr" />
        <div className="login-panel-content">
          {
            !!this.state.errMsg && 
            <div className="alert alert-danger" role="alert">
              {this.state.errMsg}
            </div>
          }
          <div className="login-panel-form-container">
            <div className="login-panel-form-item">
              <div className="login-panel-form-item-error-hint">
                {this.state.fieldErrMsg.account ? this.state.fieldErrMsg.account : ''}
              </div>
              <input type="text"
                className={`account form-control ${this.state.fieldErrMsg.account && 'error'}`}
                placeholder="帳號"
                title="帳號"
                value={this.state.formField.account}
                onChange={this.handleAccountFieldChange} />
            </div>
            <div className="login-panel-form-item">
              <div className="login-panel-form-item-error-hint">
                {this.state.fieldErrMsg.password ? this.state.fieldErrMsg.password : ''}
              </div>
              <input type="password"
                className={`password form-control ${this.state.fieldErrMsg.password && 'error'}`}
                placeholder="密碼"
                title="密碼"
                value={this.state.formField.password}
                onChange={this.handlePasswordFieldChange} />
            </div>
            <button type="button"
              className="login-submit-btn btn btn-primary"
              onClick={this.handleLoginSubmitBtnClick}>
              登入
            </button>
          </div>
        </div>
      </div>
    )
  }

  handleAccountFieldChange(event: ChangeEvent<HTMLInputElement>) {
    const formField = this.state.formField
    const fieldErrMsg = this.state.fieldErrMsg
    formField.account = event.target.value
    fieldErrMsg.account = ''
    this.setState({ formField, fieldErrMsg })
  }

  handlePasswordFieldChange(event: ChangeEvent<HTMLInputElement>) {
    const formField = this.state.formField
    const fieldErrMsg = this.state.fieldErrMsg
    formField.password = event.target.value
    fieldErrMsg.password = ''
    this.setState({ formField, fieldErrMsg })
  }

  async handleLoginSubmitBtnClick() {
    const account = this.state.formField.account
    const password = this.state.formField.password
    const res = await systemStore.login(account, password)
    if (!res.result) {
      const errMsg = res.errMsg || ''
      let fieldErrMsg = this.state.fieldErrMsg
      Object.keys(fieldErrMsg).forEach(key => fieldErrMsg[key] = '')
      Object.keys(res.errFields).forEach(key => fieldErrMsg[key] = res.errFields[key].msg)
      this.setState({ fieldErrMsg, errMsg })
    }
  }
}

const mapStatesToProps = (state: RootState) => ({
  loggedIn: state.system.loggedIn
})

export default connect(mapStatesToProps)(LoginPanel)