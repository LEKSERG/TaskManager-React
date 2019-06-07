const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

const app = express();

const cors = require("cors");
app.use(cors());


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Database Connect
const mongoURI = 'mongodb+srv://admin-lekserg:CYber256@cluster0-4xwtx.azure.mongodb.net/TaskManager'

mongoose
    .connect(mongoURI, { useNewUrlParser: true, 'useFindAndModify': false})
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));


// Setup Collection

Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
      type: String,
      required: true 
  },  
  password: {
      type: String,
      required: true 
  },
  tasks: [{type: Schema.Types.ObjectId, ref: 'Task'}]
  }
);

const taskSchema = new Schema({
  title: String,
  author: {type: Schema.Types.ObjectId, ref: 'User'}
});

const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);

// Add some default to DB
    
const  task1 = new Task({
  title: "Welcome! Here You Can:"
});

const task2 = new Task({
  title: "ADD EDIT DELETE SHARE your TASKS "
});


const defaultTasks = [task1, task2];


//

app.get('/', (req, res) => res.send('Backend-TaskManager'));


//                                          REGISTER LOGIN SYSTEM    

// POST Register

app.post('/register', (req,res) => {
     
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        tasks: defaultTasks
        
    };

    User.findOne({email: req.body.email})
        .then(user => {
            if (!user) {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    newUser.password = hash;
                    User.create(newUser)
                        .then(user => {
                            Task.insertMany(defaultTasks, function(error, task) { console.log('Add defaults');});
                            console.log('Registered');
                            res.json({ status: user.email + ' registered!' })
                        })
                        .catch(err => {
                            res.send('error: ' + err)
                        })
                })
            } else {
                res.json({ error: 'User already exists' })
            }
        })
        .catch(err => {
            res.send('error: ' + err)
    });
});


// Post Login

app.post('/login', (req,res) => {
        
    User.findOne({
        email: req.body.email
    })
        .then(user => {
            if (user) {
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    const payload = {
                        _id: user._id,
                        email: user.email
                    }
                    let token = jwt.sign(payload, somesecretword)
                    res.send(token)
                } else {
                    res.json({ error: "User does not exist" })
                }
            } else {
                res.json({ error: "User does not exist" })
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })


});


//                                                      TODO LIST



// GET Tasks

app.get('/tasks/', function(req, res){
    const email = req.query.user;  
    User
        .findOne({email: email})
        .populate('tasks')
        .exec()
        .then(foundUser => {
            data = {
                arr: [],
                email: foundUser.email
            }
            foundUser.tasks.forEach(function(task) {
            data.arr.push(task);
            });
        res.send(data);
        
        
    });
    });

// Add Task
    app.post("/newtask", function(req, res) {
        const email = req.body.email;
        const title = req.body.title;

        const task = new Task({title: title});
        task.save();
        User.findOne({email: email}, function(err, foundUser) {
        
            foundUser.tasks.push(task);
            foundUser.save(task, function(err, task) {
                if (err) {
                  res.send(err);
                }
                res.json(task);
              });
        })
    });

// Delete Task

app.post("/deletetask", function(req, res) {
    const id = req.body._id;
    console.log(id);    

    Task.findByIdAndRemove({_id: id}, function(err) {
        if (err) {
            res.send(err);
        }
        res.send('Deleted ');
        });
    });

// Edit Task

app.post("/updatetask", function(req, res) {
    const id = req.body._id;
    const title = req.body.title;
    console.log(id);    
    console.log(title);    

    Task.findByIdAndUpdate({_id: id}, {title: title}, function(err) {
        if (err) {
            res.send(err);
        }
        res.send('Updated');
        });
    });

// Share Task
    app.post("/sharetask", function(req, res) {
        const to = req.body.to;
        const from = req.body.from;
        const title = req.body.title;

        const task = new Task({title: title +' | from ' + from});
        task.save();
        User.findOne({email: to}, function(err, foundUser) {
        
            foundUser.tasks.push(task);
            foundUser.save(task, function(err, task) {
                if (err) {
                res.send(err);
                }
                res.json(task);
            });
        })
    });





app.listen(process.env.PORT || 5000, function() {
    console.log("Server started succesfuly!");
  });