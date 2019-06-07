import React, { Component } from 'react';
import axios from 'axios';


class Register extends Component {

    state = {
        email: '',
        password: ''   
    }

    

    changeEventHandler = (event) => {
        this.setState({ [event.target.name]: event.target.value});
      }

    onSubmit = (event) => {
        event.preventDefault()

        const user = {
            email: this.state.email,
            password: this.state.password
        }

        const register = newUser => {
            return axios
                .post('/register', {
                    email: newUser.email,
                    password: newUser.password,
                })
                .then(res => {
                    console.log('Registered!');
                })
        }

        register(user).then(() => {
            this.props.history.push(`/login`);
            console.log('To Login');
        })
    }


    render () {
        return (
            <div className="container centered">
                <div className="row">
                    <div className="col-md-6 mt-5 mx-auto">
                        <form  onSubmit={this.onSubmit.bind(this)}>
                            <h1 className="h3 mb-3 font-weight-normal">Please Sign Up</h1>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input type="email"
                                    className="form-control"
                                    name="email"
                                    placeholder="Enter Email"
                                    value={this.state.email}
                                    onChange={this.changeEventHandler} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input type="password"
                                    className="form-control"
                                    name="password"
                                    placeholder="Enter Password"
                                    value={this.state.password}
                                    onChange={this.changeEventHandler} />
                            </div>
                            <button type="submit" className="btn btn-lg btn-primary btn-block">
                                SIGN UP
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Register;