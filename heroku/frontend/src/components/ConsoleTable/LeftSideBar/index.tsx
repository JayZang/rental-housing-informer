import React, { Component } from 'react'
import { Link, NavLink } from 'react-router-dom'
import './LeftSideBar.scss'

class LeftSideBar extends Component {
  render() {
    return (
      <div id="left-side-bar">
        <div className="sidebar">
          <div className="sidebar-inner">
            <ul className="sidebar-menu scrollable pos-r">
              <li className="nav-item mT-30 active">
                <NavLink className="sidebar-link" activeClassName="active" to="/console/user">
                  <span className="icon-holder">
                    <i className="c-blue-500 ti-user"></i>
                  </span>
                  <span className="title">User</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <Link className='sidebar-link' to="/console">
                  <span className="icon-holder">
                    <i className="c-brown-500 ti-email"></i>
                  </span>
                  <span className="title">Email</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className='sidebar-link' to="/console">
                  <span className="icon-holder">
                    <i className="c-blue-500 ti-share"></i>
                  </span>
                  <span className="title">Compose</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div> 
    )
  }
}

export default LeftSideBar