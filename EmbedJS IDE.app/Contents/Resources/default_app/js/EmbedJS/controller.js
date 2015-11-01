var ipc = require('ipc');
var filename = null;
var filepath = null;
var data = null;
var currentFileNumber=0;
var fileContentList = {};

// // buttons
// var btAbout = document.getElementById("about");
// var btNew = document.getElementById("new");
// var btLoad = document.getElementById("load");
// var btSave = document.getElementById("save");
// var btUpload = document.getElementById("upload");

// About Button onClick
function onAbout() {
    console.log("onAbout()");
    ipc.send('onAbout', null);
}


//NEW Buuton onClick
function onNew() {
//    if (document.title[0] == '*') {
//        var arg = {
//            'name': filename,
//            'path': filepath,
//            'data': editor.getValue()
//        };
//        ipc.sendSync('onNew', arg);
//        filepath = null;
//        filename = null;
//        document.title = "EmbedJS IDE version 0.1";
//    } else {
//        filepath = null;
//        filename = null;
//        document.title = "EmbedJS IDE version 0.1";
//       
//    }
      changeColorAllFilenames();
    insertFileList("untitled.js");
    editor.setValue("");

}
//Load Button onClick
function onLoad() {
    var modified = false;
    if(document.title[0] == '*'){
        modified = true;
    }
    var arg = {
        'name' : filename,
        'path' : filepath,
        'data' : editor.getValue(),
        'modified' : modified
    }
    
      
    ipc.send('onLoad', arg);
}

//Save Button onClick
function onSave() {
    if ((fileContentList[currentFileNumber].name != null && ileContentList[currentFileNumber].path != null)||(fileContentList[currentFileNumber].name != undefined && ileContentList[currentFileNumber].path != undefined)) {
        var arg = {
            'name': filename,
            'path': filepath,
            'data': editor.getValue()
        };
        ipc.send('onSave', arg);
    } else {
        var arg = {
            'name': null,
            'path': null,
            'data': editor.getValue()
        }
        ipc.send('onSave', arg);
    }
}

//Upload Button onClick
function onUpload() {
    if (filename != null && filepath != null) {
        var arg = {
            'name': filename,
            'path': filepath,
            'data': editor.getValue()
        };
        ipc.send('onUpload', arg);
    } else {
        var arg = {
            'name': null,
            'path': null,
            'data': editor.getValue()
        }
        ipc.send('onUpload', arg);
    }
}

//Loaded Event 로드가 완료되었을 경우
ipc.on("onLoaded", function(arg) {
    filepath = arg.path;
    filename = arg.name;
    data = arg.data;
 insertFileList(filename,arg);
    editor.setValue(data);
    editor.gotoLine(1);
    document.title = filepath + " | EmbedJS IDE version 0.1";
//     insertFileList(filename);
    console.log(arg);
       fileContentList[currentFileNumber] = ArgumentInit(arg.path,arg.name,editor.getValue(),true);
       
});

//Save Event 세이브가 완료되었을 경우
ipc.on("onSaved", function(arg) {
    filepath = arg.path;
    filename = arg.name;
    console.log("saved");
    document.title = filepath + " | EmbedJS IDE version 0.1";
    fileContentList[currentFileNumber] = ArgumentInit(arg.path,arg.name,editor.getValue(),true);
    changeTabName(fileContentList[currentFileNumber]);
});

//Uploading Event 업로드 진행중일경우
ipc.on("onUploading", function(arg) {
    var btUpload = document.getElementById("upload");
    btUpload.textContent = "업로드중..";
});

//Uploaded Event 업로드가 완료되었을 경우
ipc.on("onUploaded", function(arg) {
    var btUpload = document.getElementById("upload");
    btUpload.textContent = "업로드 완료";
    setTimeout(function(){
        btUpload.textContent = "업로드";
    },3000);
});


//범준
function onHelp(id) {
   var obj = document.getElementById(id);
    if( obj.style.display === 'block' ){ 
        obj.style.display = 'none';
    } else { 
        obj.style.display = 'block';    
    }    
}

function openHelpContent(id){
   var parent = document.getElementById(id);
    var obj = parent.firstChild.nextSibling;
    console.log(obj.nodeName);
     if( obj.style.display == 'block' ){ 
        obj.style.display = 'none';
    } else { 
        obj.style.display = 'block';    
    }  
}

function changeFile(id) {
    console.log(fileContentList);
  var obj = document.getElementById(id);
    changeColorAllFilenames();
    obj.style.color ="white";
    var i = id.split("_");
    ////
    setData();
    currentFileNumber = i[1]-1;
    editor.setValue(fileContentList[currentFileNumber].data);
   
}

function insertFileList(filename){
    var obj = document.getElementById("filenamelist");
    var newLi = document.createElement("li");
    var newA = document.createElement("a");
    var newDiv = document.createElement("div");
    newDiv.setAttribute("class","deletefile");
    newDiv.setAttribute("id","deletefile_"+(obj.childElementCount+1));
    newDiv.onclick = function(){deleteTabFile(newDiv.getAttribute("id"));};
    newA.textContent = filename;
    newA.onclick = function(){changeFile(newA.getAttribute("id"));};
    newA.setAttribute("id","filename_"+(obj.childElementCount+1));
    setData();
    currentFileNumber = obj.childElementCount;
    console.log(currentFileNumber+":"+fileContentList);
    newA.style.color = "white";
    newLi.appendChild(newDiv);
    newLi.appendChild(newA);
    newLi.setAttribute("id","tabFileLine_"+(obj.childElementCount+1));
    changeColorAllFilenames();
    obj.appendChild(newLi);
 
}

function changeColorAllFilenames(){
   var obj = document.getElementById("filenamelist");
   var counts = obj.childElementCount;
   var i = 0;
    console.log(counts);
   while(counts>i){
       i++;
       var node = document.getElementById("filename_"+i);
       console.log(node);
       node.style.color = "#4b4b4b";
   
   }
    
}


function ArgumentInit(filepath, filename, data, modified,position) {
    var arg = {
        'name': filename,
        'path': filepath,
        'data': data,
        'modified': modified,
        'position' : position
    };
    return arg;
}

function setData(){
    console.log("currentnumber : " + currentFileNumber+"data:"+ editor.getValue());
 if(fileContentList[currentFileNumber] === undefined || fileContentList[currentFileNumber] ===null){
        fileContentList[currentFileNumber] = ArgumentInit(null,null,editor.getValue(),false);
        
    }else{
         fileContentList[currentFileNumber].data=editor.getValue();
        
    }  
    console.log(fileContentList);
}

function changeTabName(arg){
     var obj = document.getElementById("filename_"+(currentFileNumber+1));
    
    obj.text = arg.name;

    
}

function deleteTabFile(id){
  var i = id.split("_");
  var obj = document.getElementById("tabFileLine_"+i[1]);
    obj.style.display ="none";
}
