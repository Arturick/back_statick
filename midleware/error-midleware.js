const ApiError = require('../exeption/api-error');
const answerModule = require("../service/Answer");

module.exports = function (err, req, res, next) {
    console.log(err);
    let answer;
    if (err instanceof ApiError) {
        answer = answerModule.error(err.message, err.status);
        return res.status(err.status).json(answer)
    }
    answer = answerModule.error('Непредвиденная ошибка', 500);
    return res.status(500).json(answer);

};