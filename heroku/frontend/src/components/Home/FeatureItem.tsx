import React, { Component } from 'react'

interface FeatureItemProps {
  mainImg: string,
  title: string,
  onClick: (() => void) | undefined
}

class FeatureItem extends Component<FeatureItemProps> {
  constructor(props: any) {
    super(props)
  }
  
  render() {
    return (
      <div className="feature-item-container" onClick={this.props.onClick}>
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