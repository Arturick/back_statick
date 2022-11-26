class Answer {
    product(data) {
        let answer = {}
        answer.success = true;
        answer.product = data;
        return answer;
    }

    error(msg, msgCode){
        let answer = {}

        answer.success = false;
        answer.message = msg;
        answer.status = msgCode;
        return answer;
    }

}


module.exports = new Answer();