var express = require('express'),
  exphbs = require('express-handlebars'),
  http = require('http'),
  mongoose = require('mongoose'),
  twitter = require('twitter'),
  routes = require('./routes'),
  config = require('./config'),
  streamHandler = require('./utils/streamHandler');

// require("babel-core").transform("code", options);
// import "babel-register";

// require("babel-register");

// import express from "express";
// import exphbs from "exphbs";
// import http from "http";
// import mongoose from "mongoose";
// import twitter from "twitter";
// import Routes from "./routes";
// import Config from "./config";
// import StreamHandler from "./utils/streamHandler";

// express SERVER SETUP
var app = express();
var port = process.env.PORT || 8881;

// HANDLEBARS TEMPLATING ENGINE
// TODO: CONVERT TO PURE REACTJS
app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// DIABLE ETAG CACHE ON RESPONSE
app.disable('etag');

// DATABASE SETUP VIA MONGODB
mongoose.connect('mongodb://localhost/twttr-streamin');

// ntwitter MODULE SETUP
var twit = new twitter(config.twitter);

// ROOT URL INDEX ROUTE DECLERATION
app.get('/', routes.index);

// PAGE ROUTE URL DECLERATION
app.get('/page/:page/:skip', routes.page);

// PUBLIC FOLDER SETUP FOR STATIC ASSETS
app.use("/", express.static(__dirname + "/public/"));

// LOCK AND LOAD BABY. RUN THE SERVER
var server = http.createServer(app).listen(port, function() {
  console.log('express server listening on port ' + port);
});

// SOCKET.IO SETUP
var io = require('socket.io').listen(server);

// SET STREAM LISTENER FOR KEYWORDS
twit.stream('statuses/filter',{ track: 'twttrStreamin'}, function(stream){
  streamHandler(stream,io);
});
