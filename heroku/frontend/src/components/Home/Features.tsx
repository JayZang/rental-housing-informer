import React, { Component } from 'react'
import FeatureItem from './FeatureItem'
import linePic from '../../assets/img/line.png'
import pic591 from '../../assets/img/591.png'

interface FeaturesState {
  features: Array<{
    mainImg: string,
    title: string
  }>
}

class Features extends Component<{}, FeaturesState> {
  constructor(props: any) {
    super(props)

    this.state = {
      features: [{
        mainImg: linePic,
        title: "Line 定時推播"
      }, {
        mainImg: pic591,
        title: "訂閱 591 租屋"
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
          {this.state.features
            .map((feature, index) => (<FeatureItem mainImg={feature.mainImg} title={feature.title} key={index} />))}
        </div>
      </div>
    )
  }
}

export default Features