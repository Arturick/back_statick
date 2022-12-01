const service = require('../modules/product');
const answerModule = require('../service/Answer');

class Product{
    async sellers(req, res, next){
        try {
            const {dateFrom, flag, type, access, task1, article, date} = req.body;

            let answer = await service.seller(dateFrom, flag, type, access, task1, article, date);
            answer = answerModule.product(answer);
            res.json(answer)

        } catch (e) {
            console.log(e);
            next(e);
        }
    }


    async order(req, res, next){
        try {
            const {dateFrom, flag, type, access, task1, article, date} = req.body;

            let answer = await service.order(dateFrom, flag, type, access, task1, article, date);
            answer = answerModule.product(answer);
            res.json(answer);


        } catch (e) {
            console.log(e);
            next(e);
        }
    }


    async reportSeller(req, res, next){
        try {
            const {type, article, access, task1} = req.body;

            let answer = await service.reportSeller(type, article, access, task1);
            answer = answerModule.product(answer);
            res.json(answer);


        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    async analyze(req, res, next){
        try {
            const {article, access, task1} = req.body;

            let answer = await service.analyze(article, access, task1);
            answer = answerModule.product(answer);
            res.json(answer);

        } catch (e) {
            console.log(e);
            next(e);
        }
    }
}

module.exports = new Product();