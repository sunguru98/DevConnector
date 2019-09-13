import React from 'react'

import NavBar from './components/NavBar'
import LandingPage from './pages/LandingPage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import CreateProfilePage from './pages/CreateProfilePage'
import AddEducation from './pages/AddEducation'
import AddExperience from './pages/AddExperience'

import { Route, Switch, Redirect } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'

const App = () => {
  return (
    <div className="App">
      <NavBar />
      <Switch>
        <Route exact path='/' component={LandingPage} />
        <Route exact path='/register' component={RegisterPage} />
        <Route exact path='/login' component={LoginPage} />
        <PrivateRoute exact path='/dashboard' component={DashboardPage} />
        <PrivateRoute exact path='/create-profile' component={CreateProfilePage} />
        <PrivateRoute exact path='/edit-profile' component={CreateProfilePage} />
        <PrivateRoute exact path='/add-experience' component={AddExperience}  />
        <PrivateRoute exact path='/add-education' component={AddEducation} />
        <Redirect to='/' />
      </Switch>
    </div>
  )
}

export default App;
