const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path')
const db = require('./mongokey').MongoURI;
const User = require('./model');
const ejs = require('ejs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//middleware EJS
app.set('views', path.join(__dirname, "./views"));
app.set('view engine', 'ejs');


mongoose.connect(db, { 
    authSource: 'admin',
    useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.get("/", (req,res) => {
    User.find().then( users => {
        res.render('home.ejs', { users: users});
    })
    .catch( err => {
        console.log(err);
    })
});
//read
app.get("/search/:name", (req, res) => {
    User.findOne({ name: req.params.name})
            .then(data => {
                if(!data){
                   console.log("couldn't find user")
                }
                else{
                    User.find().then( users => {
                        res.render('home.ejs', {users: users});
                    })
                    .catch( err => {
                        console.log(err);
                    })
                }
            })
            .catch(err => {
                console.log(err);
            }); 
});

//creating
app.post("/add", (req,res) => {
    const user = new User ({
        name: req.body.name,
        email: req.body.email
    });

    user.save()
        .then( data => {
            User.find().then( users => {
            res.render('home.ejs', {users: users});
        })
        .catch( err => {
            console.log(err);
        })
    })
    .catch( err => {
        console.log(err);
    })
});

//updating
app.put("/update/:name", (req, res) => {
    User.findOneAndUpdate( { name: req.params.name}, req.body,{ useFindAndModify: false }).then( data => {
        User.find().then( users => {
            res.render('home.ejs', {users: users});
        })
        .catch( err => {
            console.log(err);
        })
    })
    .catch( err => {
        console.log(err);
    })
});

//deleting
app.delete("/delete/:name", (req, res) =>{
    User.findOneAndDelete( { name: req.params.name}).then( data => {
        if (!data) {
            console.log("error");
        } else {
            User.find().then( users => {
                res.render('home.ejs', {users: users});
            })
            .catch( err => {
                console.log(err);
            })
        }
    })
    .catch( err => {
        console.log(err);
    })
});

app.listen(3000 , ()=>{
console.log("server started on port 3000")
});

