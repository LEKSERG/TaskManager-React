import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'

class Welcome extends Component {
    render () {
        return (
            <div className="centered" >
                <div className="jumbotron">
                    <div className="container">
                        <i className="fas fa-tasks fa-6x"></i>
                        <h1 className="display-3">Task Manager</h1>
                        <p className="lead">Get your things done!</p>
                        <Link className="btn btn-light btn-lg" to="/register" role="button">Register</Link>
                        <Link  className="btn btn-dark btn-lg" to="/login" role="button">Login</Link>

                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Welcome);