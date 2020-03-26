const electron = require('electron')
const path = require('path')
const url = require('url')

const {dialog}= require('electron')
let fs= require('fs')
const { ipcMain } = require('electron')
var multer  =   require('multer')

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './files');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});

 var myParser = require("body-parser");

var upload = multer({ storage : storage}).single('myfile');
var fileNames=[]

const appex=require('express')()
const express = require('express')
appex.set('view-engine','ejs')



var fileloc=""

const app = electron.app
const BrowserWindow = electron.BrowserWindow

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 800,
        resizable: false,
        frame: false,
        icon: __dirname + '/assets/img/icon.ico'
    })

    // mainWindow.setMenu(null)

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

   //mainWindow.openDevTools();

    mainWindow.on('closed', function() {
        mainWindow = null
    })


    appex.use(myParser.urlencoded({extended : true}));
    appex.use(express.static("public"));


    appex.get("/download/:name",(req,res)=>{
      var name = req.params.name;
      var filePath = "./files/" + name;
      /*res.set("Content-Disposition",`attachment;filenam=./files/app.js`);
      res.set("Content-Type","application/octet-stream");
      *///console.log("start");
      res.download(filePath);
      //console.log("end");
      //res.redirect("*");

      });

    appex.post('/upload',function(req,res){
      upload(req,res,function(err) {
          if(err) {
              return res.end("Error uploading file.");
          }
          var temp = req.file.filename;

          fs.exists('file.json', function(exists) {

            if (exists) {
                console.log("yes file exists");
                fs.readFile('file.json','utf8',function readFileCallback(err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        obj = JSON.parse(data);
                        let flag=0;
                          for(let i=0;i<obj.files.length ;i++){
                            if(obj.files[i] === temp){
                              flag=1;
                            }
                          }
                          if(flag == 0)
                            obj.files.push(temp);
                        }
                        let json = JSON.stringify(obj);
                        fs.writeFile('file.json', json,function(err) {
                    if (err) throw err;
                    console.log('complete');
                    });

                });
            } else {
                console.log("file not exists");
                    obj.files.push(temp);

                let json = JSON.stringify(obj);
                fs.writeFile('file.json', json, function(err) {
            if (err) throw err;
            console.log('complete');
            });
            }
            //res.end("File is uploaded successfully!");
            res.redirect("*");
        });




          //res.end("File is uploaded successfully!");

      });
   });

   appex.get("*",(req,res)=>{

      fileNames=[];
     fs.readFile('file.json','utf8',function readFileCallback(err, data) {
         if (err) {
             console.log(err);
         } else {
          // console.log("sadasdasd");
             var obj = JSON.parse(data);
               for(let i=0;i<obj.files.length ;i++){
                 fileNames.push(obj.files[i]);
               }
                //console.log(fileNames);
                 res.render(path.join(__dirname , '/webpage.ejs'),{add:fileNames});

             }

           });




           });
       //res.render("<html>hello</html>")

      /*res.set("Content-Disposition",`attachment;filenam=/home/niks/test.txt`)
      res.set("Content-Type","application/octet-stream")
      res.download(fileloc)*/
      //res.sendFile(path.join(__dirname , '/webpage.html'))



}

app.on('ready', createWindow)
appex.listen(3000)


ipcMain.on('ondragstart', (event, filePath) => {

    fileloc=filePath;

  })
