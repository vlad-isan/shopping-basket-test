/**
 * Created by vlad on 21/01/17.
 */

"use strict";

let express     = require('express');
let path        = require('path');
let bodyParser  = require('body-parser');
let App         = require('./server/app');

let exp = express();

exp.use(bodyParser.json());
exp.use(bodyParser.urlencoded({ extended: false }));

exp.use('/client/dist',         express.static(path.join(__dirname, '/client/dist')));
exp.use('/node_modules',        express.static(path.join(__dirname, '/node_modules')));
exp.use('/systemjs.config.js',  express.static(path.join(__dirname, '/systemjs.config.js')));

// api router
exp.use('/api', App.router);

exp.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

let server = exp.listen(App.config.port, () => {
    console.log("App listening on port 3000");
});

module.exports.close = function () {
    server.close();
};