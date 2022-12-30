const service = require('../modules/product');
const answerModule = require('../service/Answer');
const report = require('../modules/report');
class Product{
    async sellers(user, req, res, next){
        try {
            const { graph, dateFrom, flag, type, article, date} = req.body;
            let answer = await service.seller(user, dateFrom,  graph,  flag, type, article, date);
            answer = answerModule.product(answer);
            res.json(answer)

        } catch (e) {
            console.log(e);
            next(e);
        }
    }


    async order(user, req, res, next){
        try {
            const {dateFrom, graph,  flag, type, article, date} = req.body;

            let answer = await service.order(user, dateFrom, graph,  flag, type, article, date);
            answer = answerModule.product(answer);
            res.json(answer);


        } catch (e) {
            console.log(e);
            next(e);
        }
    }


    async reportSeller(user, req, res, next){
        try {
                const {type, article} = req.body;

            let answer = await service.reportSeller(user, type, article);
            answer = answerModule.product(answer);
            res.json(answer);


        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    async getAllEconomy(user, req, res, next){
        try {


            let answer = await service.getAllEconomy(user['task1']);
            answer = answerModule.product(answer);
            res.json(answer);


        } catch (e) {
            console.log(e);
            next(e);
        }
    }
    async abcAnalyze(user, req, res, next){
        try {

            let answer = await service.abcAnalyze(user);
            answer = answerModule.product(answer);
            res.json(answer);


        } catch (e) {
            console.log(e);
            next(e);
        }
    }



    async getByArticle(user, req, res, next){
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

    async getAnalyze(user, req, res, next){
        try {
            const {article} = req.body;

            let answer = await service.getAnalyze(article);
            answer = answerModule.product(answer);
            res.json(answer);

        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    async getCompetition(user, req, res, next){
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

    async deleteMinus(user, req, res, next){
        try {
            let answer = await service.deleteMinus(user);
            answer = answerModule.product(answer);
            res.json(answer);
        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    async getMinus(user, req, res, next){
        try {

            let answer = await service.getMinus(user);
            answer = answerModule.product(answer);
            res.json(answer);

        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    async addMinus(user, req, res, next){
        try {
            const {value, isNumber, allTime, old, naming, percent} = req.body;
            let answer = await service.addMinus(user['task1'], value, isNumber, allTime, old, naming, percent);
            answer = answerModule.product(answer);
            res.json(answer);

        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    async testReport(user, req, res, next){
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

    async getAllSellerDiagram(user, req, res, next){
        try {
            let answer = await service.getAllSellerDiagram(user['task1']);
            answer = answerModule.product(answer);
            res.json(answer);

        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    async getAllOrderDiagram(user, req, res, next){
        try {


            let answer = await service.getAllOrderDiagram(user['task1']);
            answer = answerModule.product(answer);
            res.json(answer);

        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    async getAllRetail(user, req, res, next){
        try {

            let answer = await service.getAllRetail(user['task1']);
            answer = answerModule.product(answer);
            res.json(answer);

        } catch (e) {
            console.log(e);
            next(e);
        }
    }
}

module.exports = new Product();