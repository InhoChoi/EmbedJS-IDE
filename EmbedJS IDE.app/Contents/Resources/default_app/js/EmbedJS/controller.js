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
    if (document.title[0] == '*') {
        var arg = {
            'name': filename,
            'path': filepath,
            'data': editor.getValue()
        };
        ipc.sendSync('onNew', arg);
        editor.setValue("");
        filepath = null;
        filename = null;
        document.title = "EmbedJS IDE - v0.1";
    } else {
        editor.setValue("");
        filepath = null;
        filename = null;
        document.title = "EmbedJS IDE - v0.1";
    }
    changeColorAllFilenames();
    insertFileList("untitled");
    
}
//Load Button onClick
function onLoad() {
    fileContentList[currentFileNumber]=editor.getValue();
    ipc.send('onLoad', editor.getValue());
}

//Save Button onClick
function onSave() {
    if (filename != null && filepath != null) {
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

    editor.setValue(data);
    editor.gotoLine(1);
    document.title = filepath + " -- EmbedJS IDE - v0.1";
    insertFileList(filename);
});

//Save Event 세이브가 완료되었을 경우
ipc.on("onSaved", function(arg) {
    filepath = arg.path;
    filename = arg.name;
    document.title = filepath + " -- EmbedJS IDE - v0.1";
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
    fileContentList[currentFileNumber] = editor.getValue();
    editor.setValue(fileContentList[(i[1])-1]);
    currentFileNumber = i;
}

function insertFileList(filename){
    var obj = document.getElementById("filenamelist");
    var newLi = document.createElement("li");
    var newA = document.createElement("a");
    newA.textContent = filename;
    newA.onclick = function(){changeFile(newA.getAttribute("id"));};
    newA.setAttribute("id","filename_"+(obj.childElementCount+1));
    currentFileNumber = obj.childElementCount;
    console.log(currentFileNumber+":"+fileContentList);
    newA.style.color = "white";
    newLi.appendChild(newA);
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