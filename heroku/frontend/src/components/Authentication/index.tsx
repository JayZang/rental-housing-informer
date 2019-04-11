import React, { Component, ChangeEvent, MouseEvent } from 'react'
import { RouteComponentProps, Redirect } from 'react-router-dom'
import axios from 'axios'
import './Authentication.scss'

interface AuthenticationRouterParam {
  userId: string
}

interface AuthenticationProps extends RouteComponentProps<AuthenticationRouterParam> {}

interface AuthenticationState {
  email: string,
  password: string,
  passwordConfirm: string,
  userName: string
}

class Authentication extends Component<AuthenticationProps, AuthenticationState> {
  constructor(props: any) {
    super(props)

    this.handleEmailFieldChange = this.handleEmailFieldChange.bind(this)
    this.handlePasswordFieldChange = this.handlePasswordFieldChange.bind(this)
    this.handlePasswordConfirmFieldChange = this.handlePasswordConfirmFieldChange.bind(this)
    this.handleUserNameFieldChange = this.handleUserNameFieldChange.bind(this)
    this.handleAuthSubmitBtnClick = this.handleAuthSubmitBtnClick.bind(this)
    
    this.state = {
      email: '1',
      password: '2',
      passwordConfirm: '3',
      userName: 'jay'
    }
  }

  render() {
    return (
      <div id="authentication-container">
        <div className="authentication-title">
          <i className="far fa-id-card"></i> 
          <span>用戶認證</span>
        </div>
        <hr className="title-seperater-hr" />
        <div className="authentication-content">
          <div className="authentication-form-container">
            <div className="authentication-form-item">
              <input type="text" 
                className="email form-control" 
                placeholder="Email" 
                title="Email" 
                value={this.state.email} 
                onChange={this.handleEmailFieldChange}/>
            </div>
            <div className="authentication-form-item">
              <input type="password" 
                className="password form-control" 
                placeholder="密碼" 
                title="密碼" 
                value={this.state.password} 
                onChange={this.handlePasswordFieldChange}/>
            </div>
            <div className="authentication-form-item">
              <input type="password" 
                className="password-confirm form-control" 
                placeholder="再次輸入密碼" 
                title="再次輸入密碼" 
                value={this.state.passwordConfirm} 
                onChange={this.handlePasswordConfirmFieldChange}/>
            </div>
            <div className="authentication-form-item">
              <input type="text" 
                className="user-name form-control" 
                placeholder="使用者暱稱" 
                title="使用者暱稱" 
                value={this.state.userName} 
                onChange={this.handleUserNameFieldChange}/>
            </div>
            <button type="button" 
              className="auth-submit-btn btn btn-primary" 
              onClick={this.handleAuthSubmitBtnClick}>送出</button>
          </div>
        </div>
      </div>
    )
  }

  handleEmailFieldChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    this.setState({ email: value })
  }
  
  handlePasswordFieldChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    this.setState({ password: value })
  }
  
  handlePasswordConfirmFieldChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    this.setState({ passwordConfirm: value })
  }

  handleUserNameFieldChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    this.setState({ userName: value })
  }

  async handleAuthSubmitBtnClick(event: MouseEvent<HTMLButtonElement>) {
    const userId = this.props.match.params.userId
    await axios.get(`/api/authentication/${userId}`)
      .catch(res => console.log(res))
  }
}

export default Authentication