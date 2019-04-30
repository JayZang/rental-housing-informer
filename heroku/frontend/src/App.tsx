import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import './App.scss'
import TopNavBar from './components/TopNavBar'
import Home from './components/Home'
import LoginView from './components/LoginView'
import Authentication from './components/Authentication'
import LoadingAnimation from './components/LoadingAnimation'
import ConsoleTable from './components/ConsoleTable'
import * as systemStore from './stores/system'

interface AppState {
  isLoaded: boolean
}

class App extends Component<{}, AppState> {
  constructor(props: any) {
    super(props)

    this.state = {
      isLoaded: false
    }
  }

  componentWillMount() {
    const certPromise = systemStore.certLoginToken()
    const timeoutPromise = new Promise(resolve => setTimeout(() => resolve(), 1500))

    Promise.all([certPromise, timeoutPromise])
      .then(() => this.setState({ isLoaded: true }))
  }

  render() {
    return (
      <div id="app">
        {
          !this.state.isLoaded ? 
            this.renderLoading() :
            this.renderPage()
        }
      </div>
    )
  }

  renderLoading() {
    return (
      <div className="loading-animation">
        <LoadingAnimation/>
      </div>
    )
  }

  renderPage() {
    return (
      <div className="loaded-content">
        <div className="app-top-nav-bar">
          <TopNavBar title='租屋小幫手' />
        </div>
        <div className="app-content">
          <Switch>
            <Route exact path="/authentication/:userId" component={Authentication} />
            <Route exact path="/login" component={LoginView} />
            <Route path="/console" component={ConsoleTable} />
            <Route path="/" component={Home} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default App