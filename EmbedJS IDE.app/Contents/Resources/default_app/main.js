// src/main.js
var app = require('app'); // 어플리케이션 기반을 조작 하는 모듈.
var BrowserWindow = require('browser-window'); // 네이티브 브라우저 창을 만드는 모듈.
var Menu = require("menu");
var ipc = require('./ipc.js');
// Electron 개발자에게 crash-report를 보냄.
require('crash-reporter').start();

// 윈도우 객체를 전역에 유지합니다. 만약 이렇게 하지 않으면
// 자바스크립트 GC가 일어날 때 창이 자동으로 닫혀버립니다.
var mainWindow = null;
var aboutWindow = null;

// 모든 창이 닫히면 어플리케이션 종료.
app.on('window-all-closed', function() 
{
    app.quit();
});

// 이 메서드는 Electron의 초기화가 모두 끝나고
// 브라우저 창을 열 준비가 되었을 때 호출됩니다.
app.on('ready', function() {
    // 새로운 브라우저 창을 생성합니다.
    mainWindow = new BrowserWindow({
        width: 1020,
        height: 720,
        fullscreen: false
    });

    // 그리고 현재 디렉터리의 index.html을 로드합니다.
    mainWindow.loadUrl('file://' + __dirname + '/index.html');

    // 개발자 콘솔을 엽니다.
     mainWindow.openDevTools();

    // 창이 닫히면 호출됩니다.
    mainWindow.on('closed', function() {
        mainWindow = null;
    });

    // Create the Application's main menu
    var template = [{
        label: "Application",
        submenu: [{
            label: "About EmbedJS IDE",
            selector: "orderFrontStan dardAboutPanel:"
        }, {
            type: "separator"
        }, {
            label: "Quit",
            accelerator: "Command+Q",
            click: function() {
                app.quit();
            }
        }]
    }, {
        label: "Edit",
        submenu: [{
            label: "Undo",
            accelerator: "CmdOrCtrl+Z",
            selector: "undo:"
        }, {
            label: "Redo",
            accelerator: "Shift+CmdOrCtrl+Z",
            selector: "redo:"
        }, {
            type: "separator"
        }, {
            label: "Cut",
            accelerator: "CmdOrCtrl+X",
            selector: "cut:"
        }, {
            label: "Copy",
            accelerator: "CmdOrCtrl+C",
            selector: "copy:"
        }, {
            label: "Paste",
            accelerator: "CmdOrCtrl+V",
            selector: "paste:"
        }, {
            label: "Select All",
            accelerator: "CmdOrCtrl+A",
            selector: "selectAll:"
        }]
    }];

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
});