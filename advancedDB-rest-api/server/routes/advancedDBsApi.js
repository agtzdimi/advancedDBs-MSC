"use strict";
const shell = require("shelljs");

const { mongoIP, mongoPort } = require("../bin/www");
// Connection URL
const MongoDbHelper = require("./MongoDbHelper");
let url = "mongodb://" + mongoIP + ":" + mongoPort;
console.log(url);
let mongoDbHelper = new MongoDbHelper(url);

// start connection
mongoDbHelper.start(() => {
  console.log("mongodb ready");
});

// Example Usage

// mongoDbHelper
//     .collection('users')
//     .find()
//     .then(results => {

//       if (results === null) {
//         return Promise.reject('no such token');
//       }
//       userList = results.map((user, index) => {
//         return ({
//           key: user._id,
//           fullName: user.fullName,
//           role: user.role,
//           email: user.emails[0].address,
//           image: user.profile.image,
//         });
//       });
//     })
//     .then(() => {
//       res.json({ userList: userList });
//     })
//     .catch(err => {
//       res.json({ status: 'error', detail: err });
//     });

exports.searchDocument = (req, res) => {
  try {
    const distance = req.body.distance;
    const k = req.body.knn;
    const query = req.body.query;
    const search = shell.exec(
      "python3.6 " +
        __dirname +
        "/../pythonScripts/search.py --k " +
        k +
        " --metric " +
        distance +
        " --query " +
        query,
      { silent: true }
    );
    if (search.stderr !== "") {
      res.json({
        status: "error"
      });
    } else {
      res.json({
        status: "success",
        data: search
      });
    }
  } catch (error) {
    console.log(error);
  }
};
