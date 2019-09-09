import React from 'react'
import { NavLink, Link } from 'react-router-dom'

const NavBar = (props) => {
  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to='/'><i className="fas fa-code"></i> DevConnector</Link>
      </h1>
      <ul>
        <li><a href="profiles.html">Developers</a></li>
        <li><NavLink to='/register' activeClassName='active'>Register</NavLink></li>
        <li><NavLink to='/login' activeClassName='active'>Login</NavLink></li>
      </ul>
    </nav>
  )
}
 
export default NavBar