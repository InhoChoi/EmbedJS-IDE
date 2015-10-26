var ipc = require('ipc');
var filename = null;
var filepath = null;

// About Button onClick
function onAbout() {
    console.log("onAbout()");
    ipc.send('onAbout', null);
}

//Load Button onClick
function onLoad(){
    ipc.send('onLoad', editor.getValue());
}

//Save Button onClick
function onSave() {
    ipc.send('onSave', editor.getValue());
}

//Upload Button onClick
function onUpload() {
    ipc.send('onUpload', editor.getValue());
}

//Loaded Event 로드가 완료되었을 경우
ipc.on("onLoaded",function(event,arg){

	//Title Name 변경
	document.title = filename + " -- EmbedJS IDE - v0.1";
});

//Save Event 세이브가 완료되었을 경우
ipc.on("onSaved",function(event,arg){

});

//Uploaded Event 업로드가 완료되었을 경우
ipc.on("onUploaded",function(event,arg){

});