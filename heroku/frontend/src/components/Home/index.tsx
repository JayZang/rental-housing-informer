import React, { Component } from 'react'
import './Home.scss'
import Features from './Features'

class Home extends Component {
  render() {
    return (
      <div id='home-page'>
        <Features/>
      </div>
    )
  }
}

export default Home