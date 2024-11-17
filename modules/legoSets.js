require('dotenv').config();
const Sequelize = require('sequelize');


let sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: 5432,
    dialectModule: require("pg"),
    dialectOptions: {
    ssl: { rejectUnauthorized: false },
    },
    }
   );

   //Theme model

const Theme = sequelize.define(
    'Theme',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true, 
        autoIncrement: true, 
      },
      name: Sequelize.STRING,
    },
    {
      createdAt: false, // disable createdAt
      updatedAt: false, // disable updatedAt
    }
  );

//set model
  const Set = sequelize.define(
    'Set',
    {
      set_num: {
        type: Sequelize.STRING,
        primaryKey: true, 
      },
      name: Sequelize.STRING,
      year: Sequelize.INTEGER,
      num_parts: Sequelize.INTEGER,
      theme_id: Sequelize.INTEGER,
      img_url: Sequelize.STRING,
    },
    {
      createdAt: false, // disable createdAt
      updatedAt: false, // disable updatedAt
    }
  );

  Set.belongsTo(Theme, {foreignKey: 'theme_id'});




function initialize()
{
    return new Promise((resolve, reject)=>{
        sequelize.sync()
        .then(()=>{
            resolve();
        })
        .catch((error)=>{
            reject(error); 
        })
    })
    
}

function getAllSets()
{
    return new Promise((resolve, reject)=>{

        Set.findAll({
            include: [Theme]
        })
        .then((sets) => {
            resolve(sets);
        })
        .catch((error) => {
            reject(error);
        });
    })
}

function getSetByNum(setNum) {
    return new Promise((resolve, reject) => {
        Set.findAll({
            where: { set_num: setNum },
            include: [Theme]
        })
        .then((sets) => {
            if (sets.length > 0) {
                resolve(sets[0]); // Resolve with the first matching set
            } else {
                reject('Unable to find requested set');
            }
        })
        .catch((error) => {
            reject(error);
        });
    });
}

function getSetsByTheme(theme) {
    return new Promise((resolve, reject) => {
        Set.findAll({
            include: [Theme],
            where: {
                '$Theme.name$': {
                    [Sequelize.Op.iLike]: `%${theme}%`
                }
            } 
        })
        .then((sets) => {
            if (sets.length > 0) {
                resolve(sets);
            } else {
                reject('Unable to find requested sets');
            }
        })
        .catch((error) => {
            reject(error);
        });
    });
}

function addSet(setData) {
    return new Promise((resolve, reject) => {
        Set.create({
        set_num: setData.set_num,
        name: setData.name,
        year: setData.year,
        num_parts: setData.num_parts,
        img_url: setData.img_url,
        theme_id: setData.theme_id
        }
        )
            .then(() => resolve())
            .catch((err) => {
                // Rejects with a user-friendly message if an error occurs
                reject(new Error(err.errors[0].message));
            });
    });
}

function getAllThemes() {
    return new Promise((resolve, reject) => {
        Theme.findAll()
            .then((themes) => resolve(themes))
            .catch((err) => {
                // Rejects with a generic error message if an error occurs
                reject("Unable to retrieve themes");
            });
    });
}

function editSet(set_num, setData) {
    return new Promise((resolve, reject) => {
        // Use the Set model to find the set by set_num and update it with setData
        Set.update(setData, {
            where: { set_num: set_num }
        })
        .then((result) => {
            if (result[0] === 0) {
                // If no rows were updated, it means no matching set was found
                reject(new Error("No set found with the given set number."));
            } else {
                // Resolve if the update was successful
                resolve();
            }
        })
        .catch((err) => {
            // Reject with a more readable error message if an error occurs
            reject(new Error(err.errors[0].message));
        });
    });
}

function deleteSet(setNum){
    return new Promise((resolve, reject)=>{
        Set.destroy({
            where: {set_num:setNum}
        })
        .then(()=>resolve())
        .catch((err) => {
            // Reject with a more readable error message if an error occurs
            reject(new Error(err.errors[0].message));
        });
    })
}


module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme, addSet, getAllThemes, editSet, deleteSet };

