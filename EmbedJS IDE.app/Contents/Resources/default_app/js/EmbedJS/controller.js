var ipc = require('ipc');
var filename = null;
var filepath = null;
var data = null;

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
}
//Load Button onClick
function onLoad() {
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
    ipc.send('onUpload', editor.getValue());
}

//Loaded Event 로드가 완료되었을 경우
ipc.on("onLoaded", function(arg) {
    filepath = arg.path;
    filename = arg.name;
    data = arg.data;

    editor.setValue(data);
    editor.gotoLine(1);
    document.title = filepath + " -- EmbedJS IDE - v0.1";
});

//Save Event 세이브가 완료되었을 경우
ipc.on("onSaved", function(arg) {
    filepath = arg.path;
    filename = arg.name;
    document.title = filepath + " -- EmbedJS IDE - v0.1";
});

//Uploaded Event 업로드가 완료되었을 경우
ipc.on("onUploaded", function(event, arg) {

});