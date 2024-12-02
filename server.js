/********************************************************************************
 * WEB322 – Assignment 05
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: -KANISHKA Student ID: 155238223 Date: 18-11-2024
*
* Published URL: https://assignment-5-seven-hazel.vercel.app/
********************************************************************************/
const authData = require("./modules/auth-service.js"); 
const legoData = require("./modules/legoSets");
const HTTP_PORT = 8080; 
// legoData.initialize();
legoData.initialize()
.then(authData.initialize)
.then(function(){
 app.listen(HTTP_PORT, function(){
 console.log(`app listening on: ${HTTP_PORT}`);
 });
}).catch(function(err){
 console.log(`unable to start server: ${err}`);
});

const clientSessions = require('client-sessions'); 
const express = require('express'); 
const app = express(); 

const path = require('path');
app.set('views', __dirname + '/views');
require('pg'); 
app.set('view engine', 'ejs');
const Sequelize = require('sequelize');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.use(
    clientSessions({
      cookieName: 'session', // this is the object name that will be added to 'req'
      secret: 'o6LjQ5EVNC28ZgK64hDELM18ScpFQr', // this should be a long un-guessable string.
      duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
      activeDuration: 1000 * 60, // the session will be extended by this many ms each request (1 minute)
    })
);

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

function ensureLogin(req, res, next) {
    if (!req.session.user) {
      res.redirect('/login');
    } else {
      next();
    }
}

//route
app.get('/', (req, res) => {
    res.render("home");

});

app.get('/about', (req, res) => {
    res.render("about");

});

app.get('/lego/sets', (req, res) => {
    let sets = legoData.getSetsByTheme(req.query.theme || "");
    sets.then((data)=>{
         res.render("sets", {sets: data});
    })
    .catch((err)=>{
        res.status(404).render("404", {message: "Unable to find sets with the theme you provided!"});
        
    })
});

app.get('/lego/sets/:num', (req, res) => {
    let setFound = legoData.getSetByNum(req.params.num)
    setFound.then((data)=>{
        res.render("set", {set: data});
    })
    .catch((err)=>{
        res.status(404).render("404", {message: "No sets found for the given set number!"});

    })
});

app.get('/lego/addSet',ensureLogin, (req, res) => {
    let themesFound = legoData.getAllThemes();
    themesFound.then((themeData)=>{
         res.render("addSet", {themes: themeData});
    })
    .catch((err) => {
        res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
    });
    
});

app.post('/lego/addSet',ensureLogin, (req, res) => {
   
    legoData.addSet(req.body)
        .then(() => {
            res.redirect('/lego/sets'); 
        })
        .catch((err) => {
            res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
        });
});

app.get('/lego/editSet/:num', ensureLogin, (req, res) => {
    const setNum = req.params.num;

    Promise.all([legoData.getSetByNum(setNum), legoData.getAllThemes()])
        .then(([setData, themeData]) => {
            res.render('editSet', { themes: themeData, set: setData });
        })
        .catch((err) => {
            res.status(404).render('404', { message: `Set not found: ${err}` });
        });
});

app.post('/lego/editSet',ensureLogin, (req, res) => {
    const setNum = req.body.set_num; // assuming set_num is included in the form data as a hidden or readonly field
    const setData = req.body;

    legoData.editSet(setNum, setData)
        .then(() => {
            res.redirect('/lego/sets');
        })
        .catch((err) => {
            res.render('500', { message: `I'm sorry, but we have encountered the following error: ${err}` });
        });
});

app.get('/lego/deleteSet/:num',ensureLogin, (req, res)=>{
    const setNum = req.params.num;
    legoData.deleteSet(setNum)
    .then(()=>
    {
        res.redirect('/lego/sets');
    })
    .catch((err) => {
        res.render('500', { message: `I'm sorry, but we have encountered the following error: ${err}` });
    });
})

app.get('/login', (req, res) => {
    res.render('login', {userName : req.body.userName});
});

app.post('/login', (req, res)=>{
    req.body.userAgent = req.get('User-Agent');
    console.log(req.body);
    authData.checkUser(req.body).then((user) => {
        req.session.user = {
        userName: user.userName,  // authenticated user's userName
        email: user.email, // authenticated user's email
        loginHistory: user.loginHistory// authenticated user's loginHistory
        };
        res.redirect('/lego/sets');
       }).catch((err)=>{
        res.render('login', {errorMessage: err, userName: req.body.userName});
       })
});

app.get('/register', (req, res) => {
    res.render('register');
});
  
app.post('/register', (req, res) => {
    authData.RegisterUser(req.body)
        .then(() => {
            res.render("register", { successMessage: 'User created' }); 
            
        })
        .catch((err) => {
            res.render("register", {errorMessage: err, userName: req.body.userName} );
});
});


app.get('/logout', (req, res) => {
    req.session.reset(); // If your session library supports this method
    res.redirect('/'); // Redirect to home or login page after reset
});


app.get('/userHistory',ensureLogin, (req,res)=>{
    res.render("userHistory");
})

app.use((req, res, next) => {
    res.status(404).render("404", {message: "Sorry, We're unable to find what you're looking for!"});

});

// app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));