import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import './App.scss'
import TopNavBar from './components/TopNavBar'
import Home from './components/Home'
import LoginPanel from './components/LoginPanel'
import authentication from './components/Authentication'
import * as systemStore from './stores/system'

class App extends Component {
  componentWillMount() {
    systemStore.certLoginToken()
  }

  render() {
    return (
      <div id="app">
        <TopNavBar title='租屋小幫手'/>
        <div className="app-content">
          <Route exact path="/" component={Home}/>
          <Route exact path="/authentication/:userId" component={authentication}/>
          <Route exact path="/login" component={LoginPanel}/>
        </div>
      </div>
    )
  }
}

export default App