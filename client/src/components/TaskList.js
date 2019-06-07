import React, { Component } from 'react';
import axios from 'axios';



// Get user email from url  
const user = window.location.search; //?user-email; from Login




class TodoList extends Component {

    state = {
        id: '',
        email: '',
        title: '',
        tasks: [],
        editing: false,
        share: false,
        destination: ''
    }

// Log Out
   logOut = () => {        
        localStorage.removeItem('logged');
        this.props.history.push('/');
    }
// Handle Task Input

    changeEventHandler = (event) => {
        this.setState({ title: event.target.value});
    }
// Handle Input

    changeShareHandler = (event) => {
        this.setState({ destination: event.target.value});
    }

// RErender List

    componentDidMount () {
        this.getAll();       
    }

// Get Data From DB

    getAll = () => {
        axios.get(`/tasks/${user}` || `/tasks/`)
        .then(res => { 
          this.setState({
            title: "",
            email: res.data.email,
            tasks: [...res.data.arr]
          },
          () => {
            console.log('Updating DOM');
          });
        });
    };



// Add To List

    onSubmit = event => {
        event.preventDefault();

        const task = {
            title: this.state.title,
            email: this.state.email
        }

        const addToList = newTask => {
            return axios
                .post("/newtask", {title: newTask.title, email: newTask.email})
                .then(res => {
                    console.log(res);
                });
        }
        addToList(task).then(() => {
            this.getAll();            
        });
    }

// Delete From List

onDelete = (id, event) => {
    event.preventDefault();
    
    const deleteTask = (id) => {
        return axios
            .post("/deletetask", {_id: id})
            .then(res => {
                console.log(res);
            });
    }
    deleteTask(id).then(() => {
        this.getAll();            
    });
}

// Edit & Update

    onEdit = (id, title, event) => {
        event.preventDefault();
        this.setState({
        id: id,
        title: title,
        editing: true
        });
    };

    onUpdate = event => {
        event.preventDefault();
        this.setState({editing: false});

        const update = {
            id: this.state.id,
            title: this.state.title
        }

        const addToList = newTask => {
            return axios
                .post("/updatetask", {_id: update.id, title: update.title})
                .then(res => {
                    console.log(res);
                });
        }
        addToList(update).then(() => {
            this.getAll();            
        });
  };

// Share

    enableShare = (title, event) => {
        event.preventDefault();
        this.setState({
         title,
        share: true
        });
    };  
    
    cancelShare = (event) => {
        event.preventDefault();
        this.setState({
        title: '',
        share: false
        });
    };

    
    onShare = (event) => {
        event.preventDefault();
        this.setState({share: false});

        const info = {
            title: this.state.title,
            from: this.state.email,
            to: this.state.destination
        }

        const shareTo = info => {
            return axios
                .post("/sharetask", {title: info.title, from: info.from, to: info.to})
                .then(res => {
                    console.log(res);
                });
        }
        shareTo(info).then(() => {
            this.getAll();            
        });
    }

    render(

        ADD = (
            <form onSubmit={this.onSubmit}>
                <div className="input-group mb-3">
                <input 
                type="text" 
                className="form-control" 
                placeholder="NEW TASK"
                value={this.state.title}
                onChange={this.changeEventHandler} />

                <div className="input-group-append">
                    {this.state.editing ? 
                        (<button 
                            className="btn btn-outline-success" 
                            type="button"
                            onClick={this.onUpdate.bind(this)}
                            >SAVE
                        </button>                                        
                        ) :
                        (<button 
                            className="btn btn-outline-primary" 
                            type="submit"
                            >ADD
                        </button>)
                    }
                    </div>
                </div>
            </form>
        ),
                
        SEND = (
        <form onSubmit={this.onShare}>
            <div className="input-group mb-3">
                <input 
                type="text" 
                name="task"
                className="form-control" 
                placeholder="Task"
                value={this.state.title}
                onChange={this.changeEventHandler} />
            </div>
            <div className="input-group mb-3">
                <input 
                type="email" 
                name="sendTo"
                className="form-control" 
                placeholder="Send to"
                value={this.state.destination}
                onChange={this.changeShareHandler} />

                <div className="input-group-append">
                <button 
                    className="btn btn-outline-danger" 
                    type="button"
                    onClick={this.cancelShare.bind(this)}
                    >CANCEL
                </button>  
                <button 
                    className="btn btn-success" 
                    type="submit"
                    >SEND
                </button>
            
                </div>
            </div>
        </form>
        )


    ) {
        return (
        <div className="container-fluid">
            <div className="container">
                <nav className="navbar navbar-dark bg-dark">
                    <span className="navbar-brand mb-0 h1">Task Manager</span>
                    <ul className="navbar-nav">
                        <li className="nav-item active">
                            <a className="nav-link" href="" onClick={this.logOut.bind(this)}>Logout</a>
                        </li>
                    </ul>    
                </nav> 
                <div className="row text-center justify-content-center">
                    
                    <div className="col-lg-8 m-top">
                        {this.state.share ? SEND : ADD}
                    </div>
                </div>

                <div className="row text-center justify-content-center">
                    <div className="col-lg-8">

                    <table className="table  table-dark">
                        <tbody>
                        {this.state.tasks.map((task, index) => (
                            <tr key={index}>
                            <td className="text-left">{task.title}</td>
                            <td className="text-right">
                                <i 
                                    className="fas fa-share-alt-square fa-2x"
                                    onClick={this.enableShare.bind(this,task.title)}></i>
                                <i 
                                    className="fas fa-pen-square fa-2x"
                                    onClick={this.onEdit.bind(this, task._id, task.title)}></i>
                                <i 
                                    className="fas fa-minus-square fa-2x"
                                    onClick={this.onDelete.bind(this, task._id)}></i>
                            </td>                                
                            </tr>
                            ))}                       
                        </tbody>
                    </table>                    
                    </div>
                </div>
              </div>
        </div>
        );
      }
}

export default TodoList;


