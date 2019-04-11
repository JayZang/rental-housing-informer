import React, { Component } from 'react'

interface FeatureItemProps {
  mainImg: string,
  title: string
}

class FeatureItem extends Component<FeatureItemProps> {
  constructor(props: any) {
    super(props)
  }
  
  render() {
    return (
      <div className="feature-item-container">
        <div className="feature-item-main-img-container">
          <img className="feature-item-main-img" src={this.props.mainImg} alt="" />
        </div>
        <div className="feature-item-content">
          <div className="feature-item-title">
            {this.props.title}
          </div>
        </div>
      </div>
    )
  }
}

export default FeatureItem