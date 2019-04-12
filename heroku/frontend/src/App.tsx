import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import './App.scss'
import TopNavBar from './components/TopNavBar'
import Home from './components/Home'
import authentication from './components/Authentication'

class App extends Component {
  render() {
    return (
      <div id="app">
        <TopNavBar />
        <div className="app-content">
          <Route exact path="/" component={Home} />
          <Route exact path="/authentication/:userId" component={authentication} />
        </div>
      </div>
    )
  }
}

export default App