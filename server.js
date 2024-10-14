/********************************************************************************
 * WEB322 – Assignment 03
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: -KANISHKA Student ID: 155238223 Date: 30-09-2024
*
* Published URL:
********************************************************************************/
const legoData = require("./modules/legoSets");
legoData.initialize();
const express = require('express'); 
const app = express(); 
const HTTP_PORT = 8080; 
const path = require('path');
app.set('views', __dirname + '/views');
require('pg'); // explicitly require the "pg" module
const Sequelize = require('sequelize');

app.use(express.static(__dirname + 'public'));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/home.html');
});

app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/views/about.html');
});

app.get('/lego/sets', (req, res) => {
    let sets = legoData.getSetsByTheme(req.query.theme || "");
    sets.then((data)=>{
        res.send(data);
    })
    .catch((err)=>{
        res.sendFile(__dirname + '/views/404.html');
    })
});

app.get('/lego/sets/:num', (req, res) => {
    let setFound = legoData.getSetByNum(req.params.num)
    setFound.then((data)=>{
        res.send(data);
    })
    .catch((err)=>{
        res.sendFile(__dirname + '/views/404.html');
    })
});

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, './views/404.html'));
});

app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));