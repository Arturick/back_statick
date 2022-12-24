class Answer {
    product(data) {
        let answer = {}
        answer.success = true;
        answer.product = data;
        return answer;
    }

    auth(data){
        let answer = data;
        answer.success = true;
        answer.access = answer.tokens.access;
        delete answer.tokens;
        return answer;
    }

    error(msg, msgCode){
        let answer = {}

        answer.success = false;
        answer.message = msg;
        answer.status = msgCode;
        return answer;
    }

    default(data){
        let answer = {}

        answer.success = true;
        answer['data'] = data;
        answer.errors = [];
        return answer;
    }

}


module.exports = new Answer();