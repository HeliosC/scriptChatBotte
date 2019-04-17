/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



mode = process.env.mode
// 0 = Update monthly chat
// 1 = Find user's messages
// 2 = Find a word in the chat 


// if mode = 0, set the current month:
let month0 = process.env.month
let year0 =  process.env.year


// if mode = 1, set the username:
let username = process.env.username


// if mode = 2, set the word:
let word = process.env.word



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////











if (mode == "word") {
    var redis = require('redis').createClient(process.env.REDIS_URL);
    redis.on('connect', function () {
        console.log('connected');
    });

    jourint = 1
    monthint = 4
    yearint = 2019

    // let dat0 = '/'+month0+'/'+year0
    // let dat0 = year + '/' 
    content = ''

    var str = ""
    var s = ""
    // username = ".*" + username + ".*"
    // var exp = "" + username + ""
    var regex = new RegExp("[0-9]{2}:[0-9]{2} \\[.+\\] : .*" + word + ".*\\n|(\\n|^)\\*{32} Chat du [0-9]{2}\\/[0-9]{2}\\/[0-9]{4} \\*{32}\\n", "gmi");


    logrec(jourint)

    function logrec(jourint) {

        if (jourint < 10) {
            jour = '0' + jourint
        } else {
            jour = '' + jourint
        }
        if (monthint < 10) {
            month = '0' + monthint
        } else {
            month = '' + monthint
        }
        year=''+yearint

        let dat = year + '/' + month + '/' + jour
        // let path = 'chat/' + dat.substr(6,4)+ '/' + dat.substr(3,2) + '/' + dat.substr(0,2) + '-' + dat.substr(3,2) + '-' + dat.substr(6,4) + '.txt'

        // console.log(dat)

        let chatredis = "chat/" + dat
        redis.exists(chatredis, function (err, reply) {
            if (reply === 1) {
                // console.log(chatredis + 'exists');
                redis.get(chatredis, function (err, reply) {

                    reply.match(regex).forEach(function (element) {
                        if (!(/\*{32} Chat du [0-9]{2}\/[0-9]{2}\/[0-9]{4} \*{32}\n/gmi.test(element) && /\*{32} Chat du [0-9]{2}\/[0-9]{2}\/[0-9]{4} \*{32}\n/gmi.test(s))) {
                            str += s
                        }
                        s = element
                    });
                    // if (!/\*{32} Chat du [0-9]{2}\/[0-9]{2}\/[0-9]{4} \*{32}\n/gmi.test(s)) {
                    //     str += s
                    // }

                    redisquit()

                });
                if (err) throw err;
            } else {
                // console.log(chatredis + 'don\'t exists');
                redisquit()
            }
        });



    }

    function redisquit() {
        jourint += 1
        if (jourint < 32) {
            logrec(jourint)
        } else {
            monthint+=1
            jourint=1
            if(monthint<13){
                logrec(jourint)
            }else{
                yearint+=1
                monthint=1
                if(yearint<2020){
                    logrec(jourint)
                }else{
                    console.log('stop');
                    redis.set("word/"+word, str, function (err, reply) {
                        redis.quit()
                    });
                }
            }

        }
    }
}





if (mode == "username") {
    var redis = require('redis').createClient(process.env.REDIS_URL);
    redis.on('connect', function () {
        console.log('connected');
    });

    jourint = 1
    monthint = 4
    yearint = 2019

    // let dat0 = '/'+month0+'/'+year0
    // let dat0 = year + '/' 
    content = ''

    var str = ""
    var s = ""
    // username = ".*" + username + ".*"
    var exp = "" + username + ""
    var regex = new RegExp("[0-9]{2}:[0-9]{2} \\[" + username + "\\] : .*\\n|(\\n|^)\\*{32} Chat du [0-9]{2}\\/[0-9]{2}\\/[0-9]{4} \\*{32}\\n", "gmi");


    logrec(jourint)

    function logrec(jourint) {

        if (jourint < 10) {
            jour = '0' + jourint
        } else {
            jour = '' + jourint
        }
        if (monthint < 10) {
            month = '0' + monthint
        } else {
            month = '' + monthint
        }
        year=''+yearint

        let dat = year + '/' + month + '/' + jour
        // let path = 'chat/' + dat.substr(6,4)+ '/' + dat.substr(3,2) + '/' + dat.substr(0,2) + '-' + dat.substr(3,2) + '-' + dat.substr(6,4) + '.txt'

        // console.log(dat)

        let chatredis = "chat/" + dat
        redis.exists(chatredis, function (err, reply) {
            if (reply === 1) {
                // console.log(chatredis + 'exists');
                redis.get(chatredis, function (err, reply) {

                    reply.match(regex).forEach(function (element) {
                        if (!(/\*{32} Chat du [0-9]{2}\/[0-9]{2}\/[0-9]{4} \*{32}\n/gmi.test(element) && /\*{32} Chat du [0-9]{2}\/[0-9]{2}\/[0-9]{4} \*{32}\n/gmi.test(s))) {
                            str += s
                        }
                        s = element
                    });
                    if (!/\*{32} Chat du [0-9]{2}\/[0-9]{2}\/[0-9]{4} \*{32}\n/gmi.test(s)) {
                        str += s
                    }

                    redisquit()

                });
                if (err) throw err;
            } else {
                // console.log(chatredis + 'don\'t exists');
                redisquit()
            }
        });



    }

    function redisquit() {
        jourint += 1
        if (jourint < 32) {
            logrec(jourint)
        } else {
            monthint+=1
            jourint=1
            if(monthint<13){
                logrec(jourint)
            }else{
                yearint+=1
                monthint=1
                if(yearint<2020){
                    logrec(jourint)
                }else{
                    console.log('stop');
                    redis.set("user/"+username, str, function (err, reply) {
                        redis.quit()
                    });
                }
            }

        }
    }
}


























if (mode == "chat") {
    var redis = require('redis').createClient(process.env.REDIS_URL);
    redis.on('connect', function () {
        console.log('connected');
    });


    // let dat0 = '/'+month0+'/'+year0
    let dat0 = year0 + '/' + month0 + '/'
    content = ''
    jourint = 1

    logrec(jourint)

    function logrec(jourint) {

        if (jourint < 10) {
            jour = '0' + jourint
        } else {
            jour = '' + jourint
        }

        let dat = dat0 + jour
        // let path = 'chat/' + dat.substr(6,4)+ '/' + dat.substr(3,2) + '/' + dat.substr(0,2) + '-' + dat.substr(3,2) + '-' + dat.substr(6,4) + '.txt'


        let chatredis = "chat/" + dat
        redis.exists(chatredis, function (err, reply) {
            if (reply === 1) {
                // console.log(chatredis + 'exists');
                redis.get(chatredis, function (err, reply) {
                    content += reply + '\n\n\n\n'
                        + '************************************************************************************************************************************************************************\n'
                        + '************************************************************************************************************************************************************************\n'
                        + '************************************************************************************************************************************************************************\n'
                        + '************************************************************************************************************************************************************************\n'
                        + '************************************************************************************************************************************************************************\n'


                    redisquit()

                });
                if (err) throw err;
            } else {
                // console.log(chatredis + 'don\'t exists');
                redisquit()
            }
        });



    }

    function redisquit() {
        jourint += 1
        if (jourint < 32) {
            logrec(jourint)
        } else {
            console.log('stop');
            redis.set("chat/" + dat0 + "00", content, function (err, reply) {
                redis.quit()
            });
        }
    }
}