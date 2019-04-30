import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import LeftSideBar from './LeftSideBar'
import UserConsolePanel from './UserConsolePanel'
import '../../assets/third-party/admin-dashboard/styles/index.scss'
import './ConsoleTable.scss'

class ConsoleTable extends Component {
  render() {
    return (
      <div id="console-table">
        <Route path="/console" component={LeftSideBar} />
        <div className="page-container">
          <div className="console-content-container ">
            <Switch>
              <Route path="/console/user" component={UserConsolePanel} />
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}

export default ConsoleTable