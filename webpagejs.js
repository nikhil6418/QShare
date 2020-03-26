const fs = require('fs');

var fileNames = [];

function readJSONFile(){
  fileNames=[];
  fs.readFileSync('file.json','utf8',function readFileCallback(err, data) {
      if (err) {
          myConsole.log(err);
      } else {
          obj = JSON.parse(data);
            for(let i=0;i<obj.files.length ;i++){
              fileNames.push(obj.files[i]);
            }

          }
          console.log(fileNames);


        });

}

module.exports=fileNames;
