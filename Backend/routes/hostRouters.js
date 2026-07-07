//Core Module
// const path = require('path');

const express = require('express');
const hostController = require("../controllers/hostController");

const hostRouters = express.Router(); 
//Local Module
// const rootDir = require("../Utils/pathUtils");

hostRouters.get("/add-home", hostController.getAddHome);
hostRouters.post("/add-home", hostController.postAddHome);
hostRouters.get("/host-home-list", hostController.getHostHomes);
hostRouters.get("/edit-home/:homeId", hostController.getEditHome);
hostRouters.post("/edit-home", hostController.postEditHome);
hostRouters.post("/delete-home/:homeId", hostController.postDeleteHome);


module.exports = hostRouters;
