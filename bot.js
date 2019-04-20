mode = "word"
let user = "pouidesbois"
let word = "chatdehi"

let day0 = 'process.env.dateBeginDay'
let month0 = 'process.env.dateBeginMonth'
let year0 = 'process.env.dateBeginYear'

let day1 = 'process.env.dateEndDay'
let month1 = 'process.env.dateEndMonth'
let year1 = 'process.env.dateEndYear'

day0int = parseInt(day0)
month0int = parseInt(month0)
year0int = parseInt(year0)

day1int = parseInt(day1)
month1int = parseInt(month1)
year1int = parseInt(year1)

let tokenredis = process.env.REDIS_URL

var redis = require('redis').createClient(tokenredis);
redis.on('connect', function () {
    console.log('connected');
});

var str = ""
var s = ""
var regex

if (mode == "word") {
    regex = new RegExp("[0-9]{2}:[0-9]{2} \\[.+\\] : .*" + word + ".*\\n|(\\n|^)\\*{32} Chat du [0-9]{2}\\/[0-9]{2}\\/[0-9]{4} \\*{32}\\n", "gmi");
} else if (mode == "user") {
    regex = new RegExp("[0-9]{2}:[0-9]{2} \\[" + user + "\\] : .*\\n|(\\n|^)\\*{32} Chat du [0-9]{2}\\/[0-9]{2}\\/[0-9]{4} \\*{32}\\n", "gmi");
}

logrec(day0int)

function logrec(day0int) {

    if (day0int < 10) {
        jour = '0' + day0int
    } else {
        jour = '' + day0int
    }
    if (month0int < 10) {
        month = '0' + month0int
    } else {
        month = '' + month0int
    }
    year = '' + year0int

    let dat = year + '/' + month + '/' + jour

    let chatredis = "chat/" + dat
    redis.exists(chatredis, function (err, reply) {
        if (reply === 1) {
            // console.log(chatredis + 'exists');
            redis.get(chatredis, function (err, reply) {

                if (mode != "chat") {

                    reply.match(regex).forEach(function (element) {
                        if (!(/\*{32} Chat du [0-9]{2}\/[0-9]{2}\/[0-9]{4} \*{32}\n/gmi.test(element) && /\*{32} Chat du [0-9]{2}\/[0-9]{2}\/[0-9]{4} \*{32}\n/gmi.test(s))) {
                            str += s
                        }
                        s = element
                    });

                } else {
                    str += reply + '\n\n\n\n'
                        + '************************************************************************************************************************************************************************\n'
                        + '************************************************************************************************************************************************************************\n'
                        + '************************************************************************************************************************************************************************\n'
                        + '************************************************************************************************************************************************************************\n'
                        + '************************************************************************************************************************************************************************\n'

                }
                redisquit()
            });
            if (err) throw err;
        } else {
            redisquit()
        }
    });
}

function redisquit() {
    day0int += 1
    if (day0int < day1int + 1) {
        logrec(day0int)
    } else {
        month0int += 1
        day0int = 1
        if (month0int < month1int + 1) {
            logrec(day0int)
        } else {
            year0int += 1
            month0int = 1
            if (year0int < year1int + 1) {
                logrec(day0int)
            } else {
                var tag = day0 + "/" + month0 + "/" + year0 + "-" + day1 + "/" + month1 + "/" + year1
                console.log('stop');
                if (mode == "word") {
                    tag = word + "-" + tag
                } else if (mode == "user") {
                    tag = user + "-" + tag
                }
                redis.set(mode + "/" + tag, str, function (err, reply) {
                    redis.quit()
                });
            }
        }
    }
}