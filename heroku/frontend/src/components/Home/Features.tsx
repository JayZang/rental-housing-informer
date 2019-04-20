import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import FeatureItem from './FeatureItem'
import { RootState } from '../../stores'
import linePic from '../../assets/img/line.png'
import pic591 from '../../assets/img/591.png'

interface FeaturesProps extends RouteComponentProps {
  isLoggIn: boolean
}

interface FeaturesState {
  features: Array<{
    mainImg: string,
    title: string,
    onClickFunc: (() => void) | undefined
  }>
}

class Features extends Component<FeaturesProps, FeaturesState> {
  constructor(props: any) {
    super(props)

    this.handleP591FeatureClick = this.handleP591FeatureClick.bind(this)

    this.state = {
      features: [{
        mainImg: linePic,
        title: "Line 定時推播",
        onClickFunc: undefined
      }, {
        mainImg: pic591,
        title: "訂閱 591 租屋",
        onClickFunc: this.handleP591FeatureClick
      }]
    }
  }

  render() {
    return (
      <div className="features-container">
        <div className="feature-header-container">
          <div className="header-title">
            <div className="tw">
              功能
            </div>
            <div className="en">
              FEATURES
            </div>
          </div>
        </div>
        <div className="features-content">
          {this.state.features.map((feature, index) => (
            <FeatureItem mainImg={feature.mainImg} title={feature.title} key={index} onClick={feature.onClickFunc}/>
          ))}
        </div>
      </div>
    )
  }

  handleP591FeatureClick() {
    const isLogIn = this.props.isLoggIn

    if (isLogIn) {
      window.scrollTo(0, 0)
      this.props.history.push('/subscribe-591')
    } else
      this.props.history.push('/login')
  }
}

const mapStateToProps = (state: RootState) => ({
  isLoggIn: state.system.loggedIn
})

export default connect(mapStateToProps)(withRouter(Features))