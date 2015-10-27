// src/main.js
var app = require('app'); // 어플리케이션 기반을 조작 하는 모듈.
var BrowserWindow = require('browser-window'); // 네이티브 브라우저 창을 만드는 모듈.

// Electron 개발자에게 crash-report를 보냄.
require('crash-reporter').start();

// 윈도우 객체를 전역에 유지합니다. 만약 이렇게 하지 않으면
// 자바스크립트 GC가 일어날 때 창이 자동으로 닫혀버립니다.
var mainWindow = null;
var aboutWindow = null;

// 모든 창이 닫히면 어플리케이션 종료.
app.on('window-all-closed', function() {
    app.quit();
});

// 이 메서드는 Electron의 초기화가 모두 끝나고
// 브라우저 창을 열 준비가 되었을 때 호출됩니다.
app.on('ready', function() {
    // 새로운 브라우저 창을 생성합니다.
    mainWindow = new BrowserWindow({
        width: 1020,
        height: 720,
        fullscreen : false
    });

    // 그리고 현재 디렉터리의 index.html을 로드합니다.
    mainWindow.loadUrl('file://' + __dirname + '/index.html');

    // 개발자 콘솔을 엽니다.
    // mainWindow.openDevTools();

    // 창이 닫히면 호출됩니다.
    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});

//Main Process <-> Rendered Process IPC
var ipc = require('ipc');
var dialog = require('dialog');
var path = require('path');
var fs = require('fs');

//About Event
ipc.on('onAbout', function(event, arg) {
    if (aboutWindow == null) {
        aboutWindow = new BrowserWindow({
            width: 400,
            height: 300
        });
        aboutWindow.loadUrl('file://' + __dirname + '/about.html');

        aboutWindow.on('closed', function() {
            aboutWindow = null;
        });
    }
});

//Load Event
ipc.on('onLoad', function(event, arg) {
    var filepath = null;
    var filename = null;
    filepath = dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{
            name: 'EmbedJS Files',
            extensions: ['js']
        }]
    });
    if (filepath != undefined) {
        filename = path.basename(filepath[0]);
        fs.readFile(filepath[0], 'utf8', function(err, data) {
            if (err) throw err;
            var arg = {
                'name': filename,
                'path': filepath[0],
                'data': data
            };
            console.log(arg);
            event.sender.send("onLoaded", arg);
        });
    }
});

//Save Event
ipc.on('onSave', function(event, arg) {
    if (arg.name != null && arg.path != null) {
        ExistedFileWrite(arg, function(err, filepath) {
            if (err) throw err;
            var filename = path.basename(filepath);
            var arg = {
                'name': filename,
                'path': filepath,
            };
            event.sender.send('onSaved', arg);
        });
    } else {
        NoneFileWrite(arg, function(err, filepath) {
            var filename = path.basename(filepath);
            var arg = {
                'name': filename,
                'path': filepath
            };
            event.sender.send('onSaved', arg);
        });
    }
});

//Upload Event
ipc.on('onUpload', function(event, arg) {
    if (arg.name != null && arg.path != null) {
        ExistedFileWrite(arg, function(err, filepath) {
            if (err) throw err;
            var filename = path.basename(filepath);
            var arg = {
                'name': filename,
                'path': filepath,
            };
            event.sender.send('onSaved', arg);

            // Upload 부분
            event.sender.send('onUploading',arg);
        });
    } else {
        NoneFileWrite(arg, function(err, filepath) {
            if (filepath != null) {
                var filename = path.basename(filepath);
                var arg = {
                    'name': filename,
                    'path': filepath
                };
                event.sender.send('onSaved', arg);

                // Upload 부분
                event.sender.send('onUploading',arg);
            }
        });
    }
});

//onNew event
ipc.on('onNew', function(event, arg) {
    dialog.showMessageBox({
        type: "question",
        title: "Warning",
        message: "파일이 수정되었습니다. 저장하시겠습니까?",
        buttons: ['Yes', 'No']
    }, function(response) {
        if (response == 0) {
            if (arg.name != null && arg.path != null) {
                ExistedFileWrite(arg, function(err) {
                    event.returnValue = null;
                });
            } else {
                NoneFileWrite(arg, function(err) {
                    event.returnValue = null;
                });
            }
        } else if (response == 1) {
            event.returnValue = null;
        }
    });
});


//파일이 이미 존재할경우 저장 함수
function ExistedFileWrite(arg, callback) {
    var filepath = arg.path;
    fs.writeFile(filepath, arg.data, function(err) {
        callback(err, filepath);
    });
}

//파일존재하지 않을 경우에의 함수
function NoneFileWrite(arg, callback) {
    var filepath = dialog.showSaveDialog({
        filters: [{
            name: 'EmbedJS Files',
            extensions: ['js']
        }]
    });

    if (filepath != undefined) {
        var data = arg.data;
        fs.writeFile(filepath, arg.data, function(err) {
            callback(err, filepath);
        });
    } else {
        callback(null, null);
    }
}