let date = new Date();
console.log(date.getHours())

//var fs = require('fs');


var redis = require('redis').createClient(process.env.REDIS_URL);
redis.on('connect', function () {
    console.log('connected');
});

var contents = ""
var content = ""

for (var jour = 1; jour < 32; jour++) {

    if(jour<10){
        jour='0'+jour
    }

    let dat = jour+'/04/2019'
    // console.log(dat.substr(6,4))
    // console.log(dat.substr(3,2))
    // console.log(dat.substr(0,2))
    let path = 'chat/' + dat.substr(6,4)+ '/' + dat.substr(3,2) + '/' + dat.substr(0,2) + '-' + dat.substr(3,2) + '-' + dat.substr(6,4) + '.txt'
    // console.log(dat.substr(6,9))

    try {
        // fs.statSync('path/to/file');
        console.log('file or directory exists');
        //content = fs.readFileSync(path, 'utf8');
        //contents += content +'\n\n\n\n'
        +'******************************************************************************************************************************************************************************************************************************************\n'
        +'******************************************************************************************************************************************************************************************************************************************\n'
        +'******************************************************************************************************************************************************************************************************************************************\n'
        +'******************************************************************************************************************************************************************************************************************************************\n'
        +'******************************************************************************************************************************************************************************************************************************************\n'
    }
    catch (err) {
      if (err.code === 'ENOENT') {
        console.log('file or directory does not exist');
      }
    }




    try {
        let chatredis = "chat/" + dat
        redis.exists(chatredis, function (err, reply) {
            if (reply === 1) {
                // console.log('exists');
                //fs.appendFile(path, '', function (err) {
                    redis.get(chatredis, function (err, reply) {
                        //fs.writeFileSync(path, reply, { mode: 0o755 });
                    });
                    if (err) throw err;
                // console.log('File is created successfully.');
            }); 

            } else {
                // console.log(chatredis + " existe pas")
            }
        });
    } catch (err) {
        console.error(err);
    }

}

let dat = '00/04/2019'
let path = 'chat/' + dat.substr(6,4)+ '/' + dat.substr(3,2) + '/' + dat.substr(0,2) + '-' + dat.substr(3,2) + '-' + dat.substr(6,4) + '.txt'
//fs.writeFileSync(path, contents, { mode: 0o755 });

console.log("cccccccccccccccccccccccccccccccccc")
