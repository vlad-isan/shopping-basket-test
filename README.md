# Shopping Basket Technical Test

This repository holds the source code of the technical test.

Client side: Angular 2, TypeScript, ES6.

Server side: ES6, Express

Test: Jasmine-node

## Prerequisites

Node.js and npm 
    
<a href="https://docs.npmjs.com/getting-started/installing-node" target="_blank" title="Installing Node.js and updating npm">
Get it now</a> if it's not already installed on your machine.
 
 
 ## Install npm packages
 
 Install the npm packages described in the `package.json` and verify that it works:
 
 ```shell
 npm install
 npm start
 ```
 
 The `npm start` command first compiles the application, 
 then simultaneously re-compiles and runs the Node.JS server.
 
 Shut it down manually with `Ctrl-C`.

### npm scripts

Scripts defined in `package.json`:

* `npm start` - runs the compiler and a server at the same time, compiler in "watch mode"
* `npm run tsc` - runs the TypeScript compiler once.
* `npm run tsc:w` - runs the TypeScript compiler in watch mode; the process keeps running, awaiting changes to TypeScript files and re-compiling when it sees them.

Test:
* `npm test` - compiles and runs Jasmine server unit test (Only 2 small tests)