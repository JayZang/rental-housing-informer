import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import LeftSideBar from './LeftSideBar'
import '../../assets/third-party/admin-dashboard/styles/index.scss'

class ConsoleTable extends Component {
  render() {
    return (
      <div id="console-table">
        <Route path="/console" component={LeftSideBar} />
      </div>
    )
  }
}

export default ConsoleTable