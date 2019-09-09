import React from 'react';
import './App.css';

import NavBar from './components/NavBar'
import LandingPage from './pages/LandingPage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'

import { Route, Switch, Redirect } from 'react-router-dom'

const App = () => {
  return (
    <div className="App">
      <NavBar />
      <Switch>
        <Route exact path='/' component={LandingPage} />
        <Route exact path='/register' component={RegisterPage} />
        <Route exact path='/login' component={LoginPage} />
        <Redirect to='/' />
      </Switch>
    </div>
  )
}

export default App;
