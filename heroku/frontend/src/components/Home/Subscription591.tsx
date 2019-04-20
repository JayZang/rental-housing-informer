import React, { Component, ChangeEvent } from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import './Subscription591.scss'
import LoadingAnimation from '../LoadingAnimation'
import * as api591 from '../../apis/591'
import { RootState } from '../../stores'

interface Subscription591Props extends RouteComponentProps {
  isLogIn: boolean,
  loginToken: string
}

interface Subscription591States {
  inputField: {
    title: string
    url: string
  }
  fieldErrMsg: {
    title: string
    url: string
    [key: string]: string
  },
  isLoading: boolean
  isSuccess: boolean
}

class Subscription591 extends Component<Subscription591Props, Subscription591States> {
  constructor(prop: any) {
    super(prop)

    this.handleSubscribeClick = this.handleSubscribeClick.bind(this)
    this.handleTitleFieldChange = this.handleTitleFieldChange.bind(this)
    this.handleUrlFieldChange = this.handleUrlFieldChange.bind(this)

    this.state = {
      inputField: {
        title: '',
        url: '',
      },
      fieldErrMsg: {
        title: '',
        url: '',
      },
      isLoading: false,
      isSuccess: false
    }
  }

  componentWillMount() {
    if (!this.props.isLogIn)
      this.props.history.push('/')
  }

  render() {
    return (
      <div id="subscription-591">
        <div className="subscription-title-container">
          <div className="subscription-title">
            591 租屋訂閱
          </div>
        </div>
        <div className="subscription-content-container">
          <div className="left">
            <div className="input-field">
              <input type="text"
                className={`account form-control ${this.state.fieldErrMsg.title && 'error'}`}
                placeholder="訂閱名稱"
                title="訂閱名稱"
                value={this.state.inputField.title}
                onChange={this.handleTitleFieldChange} 
              />
            </div>
            <div className="input-field">
              <input type="text"
                className={`account form-control ${this.state.fieldErrMsg.url && 'error'}`}
                placeholder="591網址 https://rent.591.com.tw/..."
                title="591 網址"
                value={this.state.inputField.url}
                onChange={this.handleUrlFieldChange} 
              />
            </div>
          </div>
          <div className="right">
            <button type="button" className="btn btn-primary btn-submit" onClick={this.handleSubscribeClick}>訂閱</button>
          </div>
        </div>
        {
          this.state.fieldErrMsg.title || this.state.fieldErrMsg.url ? 
          <div className="alert alert-danger" role="alert">
            {`${this.state.fieldErrMsg.title}
            ${this.state.fieldErrMsg.title && this.state.fieldErrMsg.url ? '、' : '' }
            ${this.state.fieldErrMsg.url}`}
          </div>
          : null
        }
        { this.state.isLoading && <LoadingAnimation /> }
        {
          this.state.isSuccess && 
          <div className="alert alert-success" role="alert">
            訂閱成功，系統將為您定時推播新物件
          </div>
        }
      </div>
    )
  }

  handleTitleFieldChange(event: ChangeEvent<HTMLInputElement>) {
    const inputField = this.state.inputField
    inputField.title = event.target.value
    this.setState({ inputField })
  }

  handleUrlFieldChange(event: ChangeEvent<HTMLInputElement>) {
    const inputField = this.state.inputField
    inputField.url = event.target.value
    this.setState({ inputField })
  }

  async handleSubscribeClick() {
    this.setState({ fieldErrMsg: { title: '', url: '' } })
    const title = this.state.inputField.title
    const url = this.state.inputField.url
    const authToken = this.props.loginToken

    this.setState({ isLoading: true })
    const requestPromise = api591.addSubscription(authToken, {title, url})
    const timeoutPromise = new Promise(resolve => setTimeout(() => resolve(), 1500))
    const [res] = await Promise.all([requestPromise, timeoutPromise])
    this.setState({ isLoading: false })

    if (!res.result) {
      const errMsg = res.errMsg || ''
      let fieldErrMsg = this.state.fieldErrMsg
      Object.keys(fieldErrMsg).forEach(key => fieldErrMsg[key] = '')
      Object.keys(res.errFields).forEach(key => fieldErrMsg[key] = res.errFields[key].msg)
      this.setState({ fieldErrMsg })
      return
    }

    const inputField = this.state.inputField
    inputField.title = ''
    inputField.url = ''
    this.setState({ inputField, isSuccess: true })
  }
}

const mapStateToProps = (state: RootState) => ({
  isLogIn: state.system.loggedIn,
  loginToken: state.system.loginToken
})

export default connect(mapStateToProps)(withRouter(Subscription591))