/**
 * Created by vlad on 21/01/17.
 */

"use strict";

let express     = require('express');
let path        = require('path');
let bodyParser  = require('body-parser');
let App         = require('./server/app');

let server = express();

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

server.use('/client/dist',         express.static(path.join(__dirname, '/client/dist')));
server.use('/node_modules',        express.static(path.join(__dirname, '/node_modules')));
server.use('/systemjs.config.js',  express.static(path.join(__dirname, '/systemjs.config.js')));

server.use('/api', App.router);

server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(App.config.port, () => {
    console.log("App listening on port 3000");
});