require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
  userName: {
    type: String,
    unique: true
  },
  password: String,
  email: String,
  loginHistory: [{
    dateTime: Date,
    userAgent: String,
  }],
  
});

let User;

function initialize(){
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection(process.env.MONGODB);
        db.on('error', (err)=>{
        reject(err); // reject the promise with the provided error
        });
        db.once('open', ()=>{
        User = db.model("users", userSchema);
        resolve();
        });
    });

}

    
function RegisterUser(userData) {
    return new Promise((resolve, reject) => {
        if (userData.password !== userData.password2) {
            reject("Passwords do not match");
            return;
        }

        bcrypt.hash(userData.password, 10)
            .then((hash) => {
                userData.password = hash;

                let newUser = new User(userData);

                newUser.save()
                    .then(() => {
                        resolve();
                    })
                    .catch((err) => {
                        if (err.code === 11000) {
                            reject("User Name already taken");
                        } else {
                            reject("There was an error creating the user: " + err);
                        }
                    });
            })
            .catch(() => {
                reject("There was an error encrypting the password");
            });
    });
}
    

function checkUser(userData) {
    return new Promise((resolve, reject) => {
        User.find({ userName: userData.userName })
            .then((users) => {
                if (users.length === 0) {
                    reject(`Unable to find user: ${userData.userName}`);
                    return;
                }

                bcrypt.compare(userData.password, users[0].password)
                    .then((result) => {
                        if (!result) {
                            reject(`Incorrect Password for user: ${userData.userName}`);
                            return;
                        }

                        let user = users[0];

                        if (user.loginHistory.length === 8) {
                            user.loginHistory.pop();
                        }

                        user.loginHistory.unshift({
                            dateTime: (new Date()).toString(),
                            userAgent: userData.userAgent
                        });

                        User.updateOne(
                            { userName: user.userName },
                            { $set: { loginHistory: user.loginHistory } }
                        )
                        .then(() => {
                            resolve(user);
                        })
                        .catch((err) => {
                            reject(`There was an error verifying the user: ${err}`);
                        });
                    })
                    .catch((err) => {
                        reject(`Error comparing passwords: ${err}`);
                    });
            })
            .catch((err) => {
                reject(`Unable to find user: ${userData.userName}`);
            });
    });
}



module.exports = { initialize, RegisterUser, checkUser };