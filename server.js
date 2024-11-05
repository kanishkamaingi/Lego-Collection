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
* Published URL: https://legocollection-iota.vercel.app/
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

app.use((req, res, next) => {
    res.status(404).render("404", {message: "Sorry, We're unable to find what you're looking for!"});

});

app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));