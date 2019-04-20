import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import './Home.scss'
import HomeBanner from '../../assets/img/home-banner.jpg'
import walker01 from '../../assets/img/walker01.gif'
import walker02 from '../../assets/img/walker02.gif'
import walker03 from '../../assets/img/walker03.gif'
import walker04 from '../../assets/img/walker04.gif'
import Features from './Features'
import Subscription591 from './Subscription591'

class Home extends Component {
  contentRef: React.RefObject<HTMLDivElement>

  constructor(props: any) {
    super(props)
    this.contentRef = React.createRef()
    this.handleScrollToFeaturesContent = this.handleScrollToFeaturesContent.bind(this)
  }

  render() {
    return (
      <div id='home-page'>
        <div className="img-banner" style={{ backgroundImage: `url(${HomeBanner})`}}>
            <img className="img-walker walker01" src={walker01} alt=""/>
            <img className="img-walker walker02" src={walker02} alt=""/>
            <img className="img-walker walker03" src={walker03} alt=""/>
            <img className="img-walker walker04" src={walker04} alt=""/>
        </div>
        <div className="home-banner-container">
          <Switch>
            <Route exact path="/subscribe-591" component={Subscription591}/>
            <Route exact path="/" component={undefined}>
              <div className="welcome-content-container">
                <div className="welcome-title">
                  歡迎使用 <span>租屋小幫手</span>
                </div>
              </div>
            </Route>
          </Switch>
        </div>
        <div className="home-page-content" ref={this.contentRef}>
          <div className="btn-scroll-to-content" onClick={this.handleScrollToFeaturesContent}>
            <div className="arrow">
              ︿
            </div>
          </div>
          <Features />
        </div>
      </div>
    )
  }

  handleScrollToFeaturesContent() {
    if (!this.contentRef.current) return

    this.contentRef.current.scrollIntoView({behavior: 'smooth'})
  }
}

export default Home