/********************************************************************************
 * WEB322 – Assignment 04
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: -KANISHKA Student ID: 155238223 Date: 03-11-2024
*
* Published URL: https://assignment-5-seven-hazel.vercel.app/
********************************************************************************/
const legoData = require("./modules/legoSets");
legoData.initialize();
const express = require('express'); 
const app = express(); 
const HTTP_PORT = 8080; 
const path = require('path');
app.set('views', __dirname + '/views');
require('pg'); 
app.set('view engine', 'ejs');
const Sequelize = require('sequelize');
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

//route
app.get('/', (req, res) => {
    // res.sendFile(__dirname + '/views/home.html');
    res.render("home");

});

app.get('/about', (req, res) => {
    // res.sendFile(__dirname + '/views/about.html');
    res.render("about");

});

app.get('/lego/sets', (req, res) => {
    let sets = legoData.getSetsByTheme(req.query.theme || "");
    sets.then((data)=>{
         res.render("sets", {sets: data});
    })
    .catch((err)=>{
        // res.sendFile(__dirname + '/views/404.html');
        res.status(404).render("404", {message: "Unable to find sets with the theme you provided!"});
        
    })
});

app.get('/lego/sets/:num', (req, res) => {
    let setFound = legoData.getSetByNum(req.params.num)
    setFound.then((data)=>{
        res.render("set", {set: data});
    })
    .catch((err)=>{
        // res.sendFile(__dirname + '/views/404.html');
        res.status(404).render("404", {message: "No sets found for the given set number!"});

    })
});

app.get('/lego/addSet', (req, res) => {
    let themesFound = legoData.getAllThemes();
    themesFound.then((themeData)=>{
         res.render("addSet", {themes: themeData});
    })
    .catch((err) => {
        res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
    });
    
});

app.post('/lego/addSet', (req, res) => {
    console.log("Route /lego/addSet reached");
    console.log("Form data:", req.body);
    legoData.addSet(req.body)
        .then(() => {
            res.redirect('/lego/sets'); 
        })
        .catch((err) => {
            res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
        });
});

app.get('/lego/editSet/:num', (req, res) => {
    const setNum = req.params.num;

    // Retrieve the set data by set number and all themes
    Promise.all([legoData.getSetByNum(setNum), legoData.getAllThemes()])
        .then(([setData, themeData]) => {
            res.render('editSet', { themes: themeData, set: setData });
        })
        .catch((err) => {
            res.status(404).render('404', { message: `Set not found: ${err}` });
        });
});

app.post('/lego/editSet', (req, res) => {
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

app.get('/lego/deleteSet/:num', (req, res)=>{
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

app.use((req, res, next) => {
    res.status(404).render("404", {message: "Sorry, We're unable to find what you're looking for!"});

});

app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));