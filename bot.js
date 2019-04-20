mode = process.env.mode
let user = process.env.user
let word = process.env.word

let dateBegin = process.env.dateBegin
let dateEnd = process.env.dateEnd

let day0 = dateBegin.substr(0, 2)
let month0 = dateBegin.substr(3, 2)
let year0 = dateBegin.substr(6, 4)

let day1 = dateEnd.substr(0, 2)
let month1 = dateEnd.substr(3, 2)
let year1 = dateEnd.substr(6, 4)

day0int = parseInt(day0)
month0int = parseInt(month0)
year0int = parseInt(year0)

day1int = parseInt(day1)
month1int = parseInt(month1)
year1int = parseInt(year1)

let tokenredis = process.env.REDIS_URL

if (process.env.On == 1) {
    var redis = require('redis').createClient(tokenredis);
    redis.on('connect', function () {
        console.log('connected');
    });

    var str = ""
    var s = ""
    var regex
    var newday = '\n\n\n\n'
        + '************************************************************************************************************************************************************************\n'
        + '************************************************************************************************************************************************************************\n'
        + '************************************************************************************************************************************************************************\n'
        + '************************************************************************************************************************************************************************\n'
        + '************************************************************************************************************************************************************************\n'

    if (mode == "word") {
        regex = new RegExp("[0-9]{2}:[0-9]{2} \\[.+\\] : .*" + word + ".*\\n|(\\n|^)\\*{32} Chat du [0-9]{2}\\/[0-9]{2}\\/[0-9]{4} \\*{32}\\n", "gmi");
    } else if (mode == "user") {
        regex = new RegExp("[0-9]{2}:[0-9]{2} \\[" + user + "\\] : .*\\n|(\\n|^)\\*{32} Chat du [0-9]{2}\\/[0-9]{2}\\/[0-9]{4} \\*{32}\\n", "gmi");
    }

    logrec()

    function logrec() {

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
                                str += s //+ newday
                            }
                            s = element
                        });

                    } else {
                        str += reply + newday
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
            logrec()
        } else {
            month0int += 1
            day0int = 1
            if (month0int < month1int + 1) {
                logrec()
            } else {
                year0int += 1
                month0int = 1
                if (year0int < year1int + 1) {
                    logrec()
                } else {
                    // var tag = dateBegin + "-" + dateEnd
                    var tag = day0 + "." + month0 + "." + year0 + "-" + day1 + "." + month1 + "." + year1
                    console.log('stop');
                    if (mode == "word") {
                        tag = "word/" + word + "/" + tag
                    } else if (mode == "user") {
                        tag = "user/" + user + "/" + tag
                    } else if (mode == "chat") {
                        tag = "custom-chat/" + tag
                    }
                    redis.set(tag, str, function (err, reply) {
                        redis.quit()
                    });
                }
            }
        }
    }
}

// chat-custom/01.04.2019-05.04.2019