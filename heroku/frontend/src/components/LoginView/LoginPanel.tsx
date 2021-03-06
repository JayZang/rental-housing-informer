import React, { Component, ChangeEvent, KeyboardEvent } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { Key } from 'ts-keycode-enum';
import './LoginPanel.scss'
import LoadingAnimation from '../LoadingAnimation'
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
  isLogging: boolean
}

class LoginPanel extends Component<LoginPanelProps, LoginPanelStates> {
  constructor(props: any) {
    super(props)

    this.handleAccountFieldChange = this.handleAccountFieldChange.bind(this)
    this.handlePasswordFieldChange = this.handlePasswordFieldChange.bind(this)
    this.handleLoginSubmitBtnClick = this.handleLoginSubmitBtnClick.bind(this)
    this.handleInputEnter = this.handleInputEnter.bind(this)

    this.state = {
      formField: {
        account: '',
        password: ''
      },
      fieldErrMsg: {
        account: '',
        password: ''
      },
      errMsg: '',
      isLogging: false
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
        {
          this.state.isLogging ?
            <div className="loading-panel">
              <LoadingAnimation />
            </div> :
            this.renderLoginForm()
        }
      </div>
    )
  }

  renderLoginForm() {
    return (
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
              onKeyDown={this.handleInputEnter}
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
              onKeyDown={this.handleInputEnter}
              onChange={this.handlePasswordFieldChange} />
          </div>
          <button type="button"
            className="login-submit-btn btn btn-primary"
            onClick={this.handleLoginSubmitBtnClick}>
            登入
            </button>
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

    this.setState({ isLogging: true })
    const loginPromise = systemStore.login(account, password)
    const timeoutPromise = new Promise(resolve => setTimeout(() => resolve(), 1500))
    const [res] = await Promise.all([loginPromise, timeoutPromise])

    if (!res.result) {
      this.setState({ isLogging: false })
      const errMsg = res.errMsg || ''
      let fieldErrMsg = this.state.fieldErrMsg
      Object.keys(fieldErrMsg).forEach(key => fieldErrMsg[key] = '')
      Object.keys(res.errFields).forEach(key => fieldErrMsg[key] = res.errFields[key].msg)
      this.setState({ fieldErrMsg, errMsg })
    }
  }

  handleInputEnter(event: KeyboardEvent<HTMLInputElement>) {
    if (event.which === Key.Enter)
      this.handleLoginSubmitBtnClick()
  }
}

const mapStatesToProps = (state: RootState) => ({
  loggedIn: state.system.loggedIn
})

export default connect(mapStatesToProps)(LoginPanel)