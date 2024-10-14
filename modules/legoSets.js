const setData = require("../data/setData");
const themeData = require("../data/themeData");
let sets = [];

function initialize()
{
    return new Promise((resolve, reject)=>{
        if(setData.forEach(set => {
            const foundTheme = themeData.find((ele)=> (ele.id===set.theme_id)
            )
            let theme = foundTheme.name;
            
            sets.push({ ...set, theme });
        })) resolve();
    })
    
}

function getAllSets()
{
    return new Promise((resolve, reject)=>{

        resolve(sets);
    })
}

function getSetByNum(setNum)
{
    return new Promise((resolve, reject)=>{
        const foundSet = sets.find((set)=>set.set_num === setNum);
        if(foundSet) resolve(foundSet);
        else reject('Unable to find requested set!')
    })
}

function getSetsByTheme(theme)
{
    return new Promise((resolve, reject)=>{
        const foundSet = sets.filter((set)=>set.theme.toLowerCase().includes(theme.toLowerCase()));
        if(foundSet.length != 0) resolve(foundSet);
        else reject('Unable to find requested sets!')
    })
}

module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme };

// initialize();
// console.log(getAllSets());
// console.log(getSetByNum('100-2'));
// console.log(getSetsByTheme('9v'));

