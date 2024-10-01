const legoData = require("./modules/legoSets");
legoData.initialize();
const express = require('express'); 
const app = express(); 
const HTTP_PORT = process.env.PORT || 8080; 

app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));

app.get('/', (req, res) => {
    res.send('Assignment 2: -Kanishka - 155238223');
});

app.get('/lego/sets', (req, res) => {
    let sets = legoData.getAllSets();
    sets.then((data)=>{
        res.send(data);
    })
    .catch((err)=>{
        res.send(err);
    })
});

app.get('/lego/sets/num-demo', (req, res) => {
    let setFound = legoData.getSetByNum('10025-1')
    setFound.then((data)=>{
        res.send(data);
    })
    .catch((err)=>{
        res.send(err);
    })
});

app.get('/lego/sets/theme-demo', (req, res) => {
    let setFound = legoData.getSetsByTheme('9v')
    setFound.then((data)=>{
        res.send(data);
    })
    .catch((err)=>{
        res.send(err);
    })
});
