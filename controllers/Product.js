const service = require('../modules/product');
const answerModule = require('../service/Answer');


class Product{
    async sellers(req, res, next){
        try {
            const {token, dateFrom, flag, type} = req.body;

            let answer = await service.seller(token, dateFrom, flag, type);
            answer = answerModule.product(answer);
            res.json(answer)

        } catch (e) {
            console.log(e);
            next(e);
        }
    }


    async order(req, res, next){
        try {
            const {token, dateFrom, flag, type} = req.body;

            let answer = await service.order(token, dateFrom, flag, type);
            answer = answerModule.product(answer);
            res.json(answer);


        } catch (e) {
            console.log(e);
            next(e);
        }
    }


    async reportSeller(req, res, next){
        try {
            const {token, dateFrom, dateTo, article} = req.body;
            console.log(token);
            let answer = await service.reportSeller(token, dateFrom, dateTo, article);
            answer = answerModule.product(answer);
            res.json(answer);


        } catch (e) {
            console.log(e);
            next(e);
        }
    }
}

module.exports = new Product();