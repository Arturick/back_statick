const service = require('../modules/user');
const answerModule = require('../service/Answer');

class User {
    async register(req, res, next){
        try {
            const {login, email, password} = req.body;

            let answer = await service.register(login, email, password);
            res.cookie('refreshToken', answer['tokens']['refresh'], {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            answer = answerModule.register(answer);
            res.json(answer);

        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    async login(req, res, next){
        try {
            const {login, password} = req.body;

            let answer = await service.login(login, password);
            res.cookie('refreshToken', answer['tokens']['refresh'], {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            answer = answerModule.register(answer);
            res.json(answer);

        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    async logout(req, res, next){
        try {
            const {task1} = req.body;
            const {refreshToken} = req.cookies;
            await service.logout(task1, refreshToken);
            res.clearCookie('refreshToken');
            res.json({});

        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    async refresh(req, res, next){
        try {
            const {task1} = req.body;
            const {refreshToken} = req.cookies;
            console.log(req.cookies);
            let answer = await service.refresh(task1, refreshToken);
            res.cookie('refreshToken', answer['tokens']['refresh'], {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            answer = answerModule.register(answer);
            return res.json(answer);
        } catch (e) {
            next(e);
        }
    }

    async updateProfile(req, res, next){
        try {
            const {task1, profile, access} = req.body;
            let answer = await service.updateProfile(task1, profile, access);

            answer = answerModule.default(answer);
            return res.json(answer);
        } catch (e) {
            next(e);
        }
    }
    async getUser(req, res, next){
        try {
            const {task1, access} = req.body;
            let answer = await service.getProfile(task1, access);
            answer = answerModule.default(answer);
            return res.json(answer);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new User();
