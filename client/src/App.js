import React, { Component }from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

import Welcome from './components/Welcome';
import Login from './components/Login';
import Register from './components/Register';
import TaskList from './components/TaskList';


class App extends Component {  
  render () {
    
    return (
    
      <Router>
        <div className="App">  
        <Switch>        
          <Route exact path="/" component={Welcome} />
          {/* Prevent direct access to TaskList*/}
          <Route  path="/tasks" render={() => (localStorage.logged ? (<TaskList/>) : (<Redirect to="/"/>))}/>
          <Route exact path="/register" component={Register} />   
          <Route exact path="/login" component={Login} />
        </Switch>         
          
        </div>
      </Router>
    
  );
}
}

export default App;
