/**
 * 用於控制 Console 左邊選單面板是否開啟之按鍵
 */

import React, { Component } from 'react'
import './Controller.scss'

class LeftSideBarController extends Component {
  constructor(props: any) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  render() {
    return (
      <div id="left-side-bar-controller">
        <a id='sidebar-toggle' className="sidebar-toggle">
          <i className="ti-menu" onClick={this.handleClick}></i>
        </a>
      </div>
    )
  }

  handleClick() {
    const body = document.getElementsByTagName('body').item(0)

    if (!body) return

    body.classList.toggle('is-collapsed')
  }
}

export default LeftSideBarController