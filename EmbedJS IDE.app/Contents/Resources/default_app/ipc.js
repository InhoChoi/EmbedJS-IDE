//Main Process <-> Rendered Process IPC
var ipc = require('ipc');
var dialog = require('dialog');
var path = require('path');
var fs = require('fs');
var async = require('async');

//Board Upload
var upload = require('./writer.js').upload;

//About Event
ipc.on('onAbout', function(event, arg) {
    dialog.showMessageBox({
        type: "info",
        title: "About",
        message: "EmbedJS version 0.1",
        detail: "SW Maestro 6기 2차 프로젝트\n최인호 안영샘 김범준",
        buttons: ['close', 'Homepage']
    }, function(response) {});
});

//Load Event
ipc.on('onLoad', function(event, arg) {
    // var filepath = arg.path;
    // var filename = arg.name;
    // var modified = arg.modified;

    // if (filepath != null && filename != null && modified == true) {
    //     async.series([

    //         function(cb) {
    //             ModifiedDialog(function(response) {
    //                 if (response == 0) {
    //                     ExistedFileWrite(arg, function(err, filepath) {
    //                         if (err) throw err;
    //                         var filename = path.basename(filepath);
    //                         var arg = ArgumentInit(filepath, filename, null, null);
    //                         event.sender.send('onSaved', arg);
    //                         cb();
    //                     });
    //                 } else if (response == 1) {
    //                     cb();
    //                 }
    //             });
    //         },
    //         function(cb) {
    //             FileRead(arg, function(err, filepath, data) {
    //                 if (err) throw err;
    //                 var filename = path.basename(filepath);
    //                 var arg = ArgumentInit(filepath, filename, data, null, null);
    //                 event.sender.send("onLoaded", arg);
    //                 cb();
    //             });
    //         }
    //     ], function done(errors, results) {

    //     });
    // } else if (filepath == null && filename == null && modified == true) {
    //     async.series([

    //         function(cb) {
    //             ModifiedDialog(function(response) {
    //                 if (response == 0) {
    //                     NoneFileWrite(arg, function(err, filepath) {
    //                         if (err) throw err;
    //                         if (filepath != null) {
    //                             var filename = path.basename(filepath);
    //                             var arg = ArgumentInit(filepath, filename, null, null);
    //                             event.sender.send('onSaved', arg);
    //                             cb();
    //                         }
    //                     });
    //                 } else if (response == 1) {
    //                     cb();
    //                 }
    //             });
    //         },
    //         function(cb) {
    //             FileRead(arg, function(err, filepath, data) {
    //                 if (err) throw err;
    //                 if (filepath != null) {
    //                     var filename = path.basename(filepath);
    //                     var arg = ArgumentInit(filepath, filename, data, null, null);
    //                     event.sender.send("onLoaded", arg);
    //                     cb();
    //                 }
    //             });
    //         }
    //     ], function done(errors, results) {

    //     });

    // } else {
    FileRead(arg, function(err, filepath, data) {
        if (err) throw err;
        if (filepath != null) {
            var filename = path.basename(filepath);
            var arg = ArgumentInit(filepath, filename, data, null, null);
            event.sender.send("onLoaded", arg);
        }
    });
    // }
});

//Save Event
ipc.on('onSave', function(event, arg) {
    if (arg.name != null && arg.path != null) {
        ExistedFileWrite(arg, function(err, filepath) {
            if (err) throw err;
            var filename = path.basename(filepath);
            var arg = ArgumentInit(filepath, filename, null, null);
            event.sender.send('onSaved', arg);
        });
    } else {
        NoneFileWrite(arg, function(err, filepath) {
            if (err) throw err;
            if (filepath != null) {
                var filename = path.basename(filepath);
                var arg = ArgumentInit(filepath, filename, null, null);
                event.sender.send('onSaved', arg);
            }
        });
    }
});

//Upload Event
ipc.on('onUpload', function(event, arg) {
    if (arg.name != null && arg.path != null) {
        ExistedFileWrite(arg, function(err, filepath) {
            if (err) throw err;
            var filename = path.basename(filepath);
            var arg = ArgumentInit(filepath, filename, null, null);

            event.sender.send('onSaved', arg);

            // Upload 부분
            event.sender.send('onUploading', arg);

            upload(filepath, function(err, result) {
                if (result['stderr'] != '') {
                    dialog.showMessageBox({
                        type: "info",
                        title: "About",
                        message: "업로드 결과",
                        detail: result['stderr'],
                        buttons: ['close']
                    }, function(response) {});
                }
                event.sender.send('onUploaded', arg);
            });
        });
    } else {
        NoneFileWrite(arg, function(err, filepath) {
            if (filepath != null) {
                var filename = path.basename(filepath);
                var arg = ArgumentInit(filepath, filename, null, null);
                event.sender.send('onSaved', arg);

                // Upload 부분
                event.sender.send('onUploading', arg);

                upload(filepath, function(err, result) {
                    if (result['stderr'] != '') {
                        dialog.showMessageBox({
                            type: "info",
                            title: "About",
                            message: "업로드 결과",
                            detail: result['stderr'],
                            buttons: ['close']
                        }, function(response) {});
                    }
                    event.sender.send('onUploaded', arg);
                });
            }
        });
    }
});

//onNew event
ipc.on('onNew', function(event, arg) {
    ModifiedDialog(function(response) {
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

//존재하는 파일 Read
function FileRead(arg, callback) {
    var filename = null;
    var filepath = dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{
            name: 'EmbedJS Files',
            extensions: ['js']
        }]
    });
    if (filepath != undefined) {
        fs.readFile(filepath[0], 'utf8', function(err, data) {
            callback(err, filepath[0], data);
        });
    }
}

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

//Main-Process <-> Render-Process 간의 데이터 초기화

function ArgumentInit(filepath, filename, data, modified) {
    var arg = {
        'name': filename,
        'path': filepath,
        'data': data,
        'modified': modified
    };
    return arg;
}

// 수정이 되었을 경우의 Dialog
function ModifiedDialog(response) {
    dialog.showMessageBox({
        type: "question",
        title: "Warning",
        message: "파일이 수정되었습니다. 저장하시겠습니까?",
        buttons: ['Yes', 'No']
    }, response);
}