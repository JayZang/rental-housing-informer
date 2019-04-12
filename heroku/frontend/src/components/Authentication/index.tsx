import React, { Component, ChangeEvent, MouseEvent } from 'react'
import { RouteComponentProps, Redirect } from 'react-router-dom'
import AuthSuccessPanel from './AuthSuccessPanel'
import './Authentication.scss'
import { checkIfNeedAuth, signUpUser } from '../../apis'

interface AuthenticationRouterParam {
  userId: string
}

interface AuthenticationProps extends RouteComponentProps<AuthenticationRouterParam> {}

interface AuthenticationState {
  isLoaded: boolean
  isNeedAuth: boolean
  authKey: string
  account: string
  email: string
  password: string
  passwordConfirm: string
  fullName: string
  nickName: string
  sex: string,
  fieldErrMsg: {
    account: string
    email: string
    password: string
    passwordConfirm: string
    fullName: string
    nickName: string
    [key: string]: string
  }
}

class Authentication extends Component<AuthenticationProps, AuthenticationState> {
  constructor(props: any) {
    super(props)

    this.handleAccountFieldChange         = this.handleAccountFieldChange.bind(this)
    this.handleEmailFieldChange           = this.handleEmailFieldChange.bind(this)
    this.handlePasswordFieldChange        = this.handlePasswordFieldChange.bind(this)
    this.handlePasswordConfirmFieldChange = this.handlePasswordConfirmFieldChange.bind(this)
    this.handleFullNameFieldChange        = this.handleFullNameFieldChange.bind(this)
    this.handleNickNameFieldChange        = this.handleNickNameFieldChange.bind(this)
    this.handleSexFieldChange             = this.handleSexFieldChange.bind(this)
    this.handleAuthSubmitBtnClick         = this.handleAuthSubmitBtnClick.bind(this)
    
    this.state = {
      isLoaded: false,
      isNeedAuth: false,
      authKey: '',
      account: '',
      email: '',
      password: '',
      passwordConfirm: '',
      fullName: '',
      nickName: '',
      sex: '0',
      fieldErrMsg: {
        account: '',
        email: '',
        password: '',
        passwordConfirm: '',
        fullName: '',
        nickName: '',
      }
    }
  }

  componentWillMount() {
    const userId = this.props.match.params.userId
    checkIfNeedAuth(userId)
      .then(result => this.setState({ isLoaded: true, isNeedAuth: result }))
  }

  render() {
    if (!this.state.isLoaded)
      return null
    else if (!this.state.isNeedAuth)
      return <Redirect to="/" />
    else
      return (
        <div id="authentication-container">
          <div className="authentication-title">
            <i className="far fa-id-card"></i> 
            <span>用戶註冊及認證</span>
          </div>
          <hr className="title-separator-hr" />
          <div className="authentication-content">
            {this.state.authKey ? 
              <AuthSuccessPanel authKey={this.state.authKey} />  : 
              <div className="authentication-form-container">
                <div className="authentication-form-item">
                  <div className="authentication-form-item-error-hint">
                    {this.state.fieldErrMsg.account ? this.state.fieldErrMsg.account : ''}
                  </div>
                  <input type="text"
                    className={`account form-control ${this.state.fieldErrMsg.account && 'error'}`}
                    placeholder="帳號"
                    title="帳號"
                    value={this.state.account}
                    onChange={this.handleAccountFieldChange} />
                </div>
                <div className="authentication-form-item">
                  <div className="authentication-form-item-error-hint">
                    {this.state.fieldErrMsg.email ? this.state.fieldErrMsg.email : ''}
                  </div>
                  <input type="text" 
                    className={`email form-control ${this.state.fieldErrMsg.email && 'error'}`}
                    placeholder="Email" 
                    title="Email" 
                    value={this.state.email} 
                    onChange={this.handleEmailFieldChange}/>
                </div>
                <div className="authentication-form-item">
                  <div className="authentication-form-item-error-hint">
                    {this.state.fieldErrMsg.password ? this.state.fieldErrMsg.password : ''}
                  </div>
                  <input type="password" 
                    className={`password form-control ${this.state.fieldErrMsg.password && 'error'}`}
                    placeholder="密碼" 
                    title="密碼" 
                    value={this.state.password} 
                    onChange={this.handlePasswordFieldChange}/>
                </div>
                <div className="authentication-form-item">
                  <div className="authentication-form-item-error-hint">
                    {this.state.fieldErrMsg.passwordConfirm ? this.state.fieldErrMsg.passwordConfirm : ''}
                  </div>
                  <input type="password" 
                    className={`password-confirm form-control ${this.state.fieldErrMsg.passwordConfirm && 'error'}`}
                    placeholder="再次輸入密碼" 
                    title="再次輸入密碼" 
                    value={this.state.passwordConfirm} 
                    onChange={this.handlePasswordConfirmFieldChange}/>
                </div>
                <div className="authentication-form-item">
                  <div className="authentication-form-item-error-hint">
                    {this.state.fieldErrMsg.fullName ? this.state.fieldErrMsg.fullName : ''}
                  </div>
                  <input type="text"
                    className={`full-name form-control ${this.state.fieldErrMsg.fullName && 'error'}`}
                    placeholder="真實姓名"
                    title="真實姓名"
                    value={this.state.fullName}
                    onChange={this.handleFullNameFieldChange} />
                </div>
                <div className="authentication-form-item">
                  <div className="authentication-form-item-error-hint">
                    {this.state.fieldErrMsg.nickName ? this.state.fieldErrMsg.nickName : ''}
                  </div>
                  <input type="text" 
                    className={`nick-name form-control ${this.state.fieldErrMsg.nickName && 'error'}`}
                    placeholder="暱稱" 
                    title="暱稱" 
                    value={this.state.nickName} 
                    onChange={this.handleNickNameFieldChange}/>
                </div>
                <div className="authentication-form-item">
                  <select className="sex custom-select" value={this.state.sex} onChange={this.handleSexFieldChange}>
                    <option value="0">男</option>
                    <option value="1">女</option>
                  </select>
                </div>
                <button type="button" 
                  className="auth-submit-btn btn btn-primary" 
                  onClick={this.handleAuthSubmitBtnClick}>送出</button>
              </div>
            }
          </div>
        </div>
      )
  }

  handleAccountFieldChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    const fieldErrMsg = this.state.fieldErrMsg
    fieldErrMsg.account = ''
    this.setState({ account: value, fieldErrMsg })
  }

  handleEmailFieldChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    const fieldErrMsg = this.state.fieldErrMsg
    fieldErrMsg.email = ''
    this.setState({ email: value, fieldErrMsg })
  }
  
  handlePasswordFieldChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    const fieldErrMsg = this.state.fieldErrMsg
    fieldErrMsg.password = ''
    this.setState({ password: value, fieldErrMsg })
  }
  
  handlePasswordConfirmFieldChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    const fieldErrMsg = this.state.fieldErrMsg
    fieldErrMsg.passwordConfirm = ''
    this.setState({ passwordConfirm: value, fieldErrMsg })
  }

  handleFullNameFieldChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    const fieldErrMsg = this.state.fieldErrMsg
    fieldErrMsg.fullName = ''
    this.setState({ fullName: value, fieldErrMsg })
  }

  handleNickNameFieldChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    const fieldErrMsg = this.state.fieldErrMsg
    fieldErrMsg.nickName = ''
    this.setState({ nickName: value, fieldErrMsg })
  }

  handleSexFieldChange(event: ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value
    this.setState({ sex: value })
  }

  async handleAuthSubmitBtnClick(event: MouseEvent<HTMLButtonElement>) {
    const userId = this.props.match.params.userId
    const state = this.state
    const res = await signUpUser(userId, state)

    if (!res.result) {
      let fieldErrMsg = state.fieldErrMsg
      Object.keys(fieldErrMsg).forEach(key => fieldErrMsg[key] = '')
      Object.keys(res.errFields).forEach(key => fieldErrMsg[key] = res.errFields[key].msg)
      this.setState({ fieldErrMsg })
      return
    }

    const authKey= res.authKey
    this.setState({ authKey })
  }
}

export default Authentication