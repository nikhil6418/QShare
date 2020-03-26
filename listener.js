//hello

const {ipcRenderer}=require('electron');
const mkdirp = require('mkdirp');

//adding console module
var nodeConsole = require('console');
var myConsole = new nodeConsole.Console(process.stdout, process.stderr);
//myConsole.log('Hello World!');

//adding fs module
/*var remote = require('electron').remote
var fs = remote.require('fs');*/

//const fs = require("fs");
//const path = require("path");
var $ = require('jquery');
var dragFile= document.getElementById("drag-file");
var dat;



//code to create folder for storing files
myConsole.log('Hello World2');
mkdirp('files',function(err){
  if(err) myConsole.log(err);
  else myConsole.log('folder created');
 });
myConsole.log('Hello World3');


var content;
myConsole.log("lol");
fs.readFile('main.js', function read(err, data) {
    if (err) {
        throw err;
    }
    content = data;
    myConsole.log('content');
});



dragFile.addEventListener('drop', function (e) {
      e.preventDefault();
      e.stopPropagation();

      for (let f of e.dataTransfer.files) {

        console.log('The file(s) you dragged: ', f);

        dat=f.path;
        }
        ipcRenderer.send('ondragstart', dat);
    });


    dragFile.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();
      });
