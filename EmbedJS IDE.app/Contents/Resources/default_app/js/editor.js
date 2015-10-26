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