const service = require('../modules/product');
const answerModule = require('../service/Answer');
const report = require('../modules/report');
class Product{
    async sellers(req, res, next){
        try {
            const {dateFrom, flag, type, access, task1, article, date} = req.body;
            console.log(access);
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
            console.log(access);
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



    async getByArticle(req, res, next){
        try {
            const {article} = req.body;

            let answer = await service.getProduct(article);
            answer = answerModule.product(answer);
            res.json(answer);


        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    async getAnalyze(req, res, next){
        try {
            const {article, access, task1} = req.body;

            let answer = await service.getAnalyze(article, access);
            answer = answerModule.product(answer);
            res.json(answer);

        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    async getCompetition(req, res, next){
        try {
            const {article1, article2, access, task1} = req.body;

            let answer = await service.getCompetition(article1, article2, access);
            answer = answerModule.product(answer);
            res.json(answer);

        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    async testReport(req, res, next){
        try {
            const {article1, article2, access, task1} = req.body;

            let answer = await report.test();
            answer = answerModule.product(answer);
            res.json(answer);

        } catch (e) {
            console.log(e);
            next(e);
        }
    }
}

module.exports = new Product();