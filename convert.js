const remote = require('electron').remote

//start

const qr = require('qr-image');
const fs = require('fs');
const ip = require('ip');
var address=ip.address();
var qc="http://"+address+":3000";
var qr_png = qr.imageSync(qc,{type:'png',size:10});
//end


$(document).ready(function() {

    // Window Controls

    $(".winmini").click(function() {
        var window = remote.getCurrentWindow();
        window.minimize();
    });

    // $(".winmax").click(function() {
    //     var window = remote.getCurrentWindow();
    //     if (!window.isMaximized()) {
    //         window.maximize();
    //     } else {
    //         window.unmaximize();
    //     }
    // });

    $(".winclose").click(function() {
        var window = remote.getCurrentWindow();
        window.close();
    });

    // Convert to QR Code

    new Vue({
        el: '#app',
        data: {
            plainText: ''
        },
        methods: {
            setImage: function() {

                if (this.plainText == '') {

                    fs.writeFileSync('./assets/img/' + 'newTest', qr_png, {flag:'w'}, (err) => {
                      if(err){
                       console.log(err);
                      }
                    });

                    console.log(qr_png);
                    return "assets/img/newTest";
                    /*return "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + this.plainText;*/

                }else {
                    return "assets/img/newTest";
                }
            }
        }
    })
});




///////////////////////
//hello

const {ipcRenderer}=require('electron');
const mkdirp = require('mkdirp');

//adding console module
var nodeConsole = require('console');
var myConsole = new nodeConsole.Console(process.stdout, process.stderr);
//myConsole.log('Hello World!');


let obj = {
    files: []
};

var fileNames=[];


var $ = require('jquery');
var dragFile= document.getElementById("drag-file");
var newData;
var newName;
var newPath;


//code to create folder for storing files
mkdirp('files',function(err){
  if(err) myConsole.log(err);
  else myConsole.log("folder created");

 });


/*var content;
fs.readFile('./main.js', function read(err, data) {
    if (err) {
        throw err;
    }
    content = data;
    myConsole.log(content);
});
*/

//function starts

function readJSONFile(){
  fileNames=[];
  fs.readFile('file.json','utf8',function readFileCallback(err, data) {
      if (err) {
          myConsole.log(err);
      } else {
          obj = JSON.parse(data);
            for(let i=0;i<obj.files.length ;i++){
              fileNames.push(obj.files[i]);
            }

          }
          /*myConsole.log(fileNames);
          myConsole.log(fileNames.length);*/
          if(fileNames.length>0){
            var tester = document.getElementById('tester');
            tester.innerHTML = fileNames.map(function(fileName) {
                  return `<div class="list-item">
                    <a href="./files/`+fileName+`" class="list-group-item" download>`+fileName+`</a>
                  </div>`;
                }).join('');

          }

        });

}



//function ends



//function starts

function writeJSONFile(newName){
  fs.exists('file.json', function(exists) {

    if (exists) {
        myConsole.log("yes file exists");
        fs.readFile('file.json','utf8',function readFileCallback(err, data) {
            if (err) {
                myConsole.log(err);
            } else {
                obj = JSON.parse(data);
                let flag=0;
                  for(let i=0;i<obj.files.length ;i++){
                    if(obj.files[i] === newName){
                      flag=1;
                    }
                  }
                  if(flag == 0)
                    obj.files.push(newName);
                }
                let json = JSON.stringify(obj);
                fs.writeFile('file.json', json,function(err) {
            if (err) throw err;
            myConsole.log('complete');
            });

        });
    } else {
        myConsole.log("file not exists");
            obj.files.push(newName);

        let json = JSON.stringify(obj);
        fs.writeFile('file.json', json, function(err) {
    if (err) throw err;
    console.log('complete');
    });
    }
});

}

//function ends


dragFile.addEventListener('drop', function (e) {
      e.preventDefault();
      e.stopPropagation();

      for (let f of e.dataTransfer.files) {
        console.log('The file(s) you dragged: ', f);
        newData=f.path;
        newName=f.name;//.type , .size
        }

        //read file starts
        fs.readFile(newData, 'utf-8', (err, data) => {

        if(err){
           alert("An error ocurred reading the file :" + err.message)
           return
        }

        newPath="./files/" + newName;
        //myConsole.log(data);
        //myConsole.log(newPath);

        fs.writeFile(newPath, data , function (err) {
          if (err) throw err;
          myConsole.log('File is created successfully.');
        });

        })

        writeJSONFile(newName);

        //read file ends
        ipcRenderer.send('ondragstart', newData);
    });


    dragFile.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();
      });


      function getServerInfo(){
        readJSONFile();


      }
      getServerInfo();
      setInterval(function(){
        getServerInfo();
      },2000);

    
