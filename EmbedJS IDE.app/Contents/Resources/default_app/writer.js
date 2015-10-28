var exec = require('child_process').exec,
    child;
var async = require('async');
var fs = require('fs');

var header = "var PINA = 0;var PINB = 1;var PINC = 2;var PIND = 3;var PINE = 4;var PINF = 5;var INPUT = 0;var OUTPUT = 1;var LOW = 0;var HIGH = 1;";
function upload(filepath, callback) {
    async.series([
    	//파일 내용 수정 및 저장
        function(cb) {
        	fs.readFile(filepath,function(err,data){
        		data = header + data + '\x00\x00\x00\x00';
        		console.log(data);
        		fs.writeFile('/tmp/jstemp',data,function(err){
        			if(err) throw err;
        			cb();
        		})
        	});
        },
        //OpenOCD Check
        function(cb){
            fs.stat('/usr/local/bin/openocd', function(err, stats){
                if(err) throw err;
                cb();
            });
        },
        //Board 업로드
        function(cb) {
            exec('/usr/local/bin/openocd -f interface/olimex-arm-usb-ocd.cfg -f target/stm32f2x.cfg -c "program /tmp/jstemp 0x080C0000;resume;exit"', function(error, stdout, stderr) {
                var result = {
                    'stdout' : stdout,
                    'stderr' : stderr,
                };
                cb(error,result);
            });
        }
    ], function done(errors, results) {
    	callback(errors,results[2]);
    });
}
exports.upload = upload;