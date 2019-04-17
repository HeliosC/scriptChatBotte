let month0 = '04'
let year0 = '2019'


const redisToken = "redis://h:pa2565d85984f854fdb083158727b752ad192735778ef60f16a1b76f5f0373304@ec2-52-211-79-208.eu-west-1.compute.amazonaws.com:16579"
var redis = require('redis').createClient(redisToken);
redis.on('connect', function () {
    console.log('connected');
});


let dat0 = '/'+month0+'/'+year0
content=''
jourint = 1

logrec(jourint)

function logrec(jourint){

    if(jourint<10){
        jour='0'+jourint
    }else{
        jour=''+jourint
    }

    let dat = jour+dat0
    let path = 'chat/' + dat.substr(6,4)+ '/' + dat.substr(3,2) + '/' + dat.substr(0,2) + '-' + dat.substr(3,2) + '-' + dat.substr(6,4) + '.txt'


    let chatredis = "chat/" + dat
    redis.exists(chatredis, function (err, reply) {
        if (reply === 1) {
            console.log(chatredis+'exists');
                redis.get(chatredis, function (err, reply) {
                    content += reply +'\n\n\n\n'
                    +'************************************************************************************************************************************************************************\n'
                    +'************************************************************************************************************************************************************************\n'
                    +'************************************************************************************************************************************************************************\n'
                    +'************************************************************************************************************************************************************************\n'
                    +'************************************************************************************************************************************************************************\n'


                    jourint+=1
                    if(jourint<32){
                        logrec(jourint)
                    }else{
                        console.log('stop');
                        redis.set("chat/00" + dat0,content)
                    }

                });
                if (err) throw err;
        }else{
            console.log(chatredis+'don\'t exists');
            jourint+=1
            if(jourint<32){
                logrec(jourint)
            }else{
                console.log('stop');
                redis.set("chat/00" + dat0,content)
            }
        }
    });



}

