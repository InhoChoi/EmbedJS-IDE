//Editor 관련 설정
var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/javascript");
editor.setOptions({
    enableBasicAutocompletion: true
});

//Editor의 내용이 변경되었을 경우  
editor.getSession().on('change', function(e) {
    if (document.title[0] != '*') {
        document.title = '*' + document.title;
    }
});

//Save Command
editor.commands.addCommand({
    name: 'Save',
    bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
    exec: function(editor) {
    	onSave();
    },
    readOnly: true // false if this command should not apply in readOnly mode
});

//Load Command
editor.commands.addCommand({
    name: 'Load',
    bindKey: {win: 'Ctrl-O',  mac: 'Command-O'},
    exec: function(editor) {
    	onLoad();
    },
    readOnly: true // false if this command should not apply in readOnly mode
});

//New Command
editor.commands.addCommand({
    name: 'New',
    bindKey: {win: 'Ctrl-N',  mac: 'Command-N'},
    exec: function(editor) {
    	onNew();
    },
    readOnly: true // false if this command should not apply in readOnly mode
});