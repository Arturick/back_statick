const service = require('../modules/user');
const answerModule = require('../service/Answer');

class User {
    async register(req, res, next){
        try {
            const {login, email, password} = req.body;

            let answer = await service.register(login, email, password);
            res.cookie('refreshToken', answer['tokens']['refresh'], {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            answer = answerModule.auth(answer);
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
            answer = answerModule.auth(answer);
            res.json(answer);

        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    async logout(req, res, next){
        try {
            const {userId} = req.body;
            const {refreshToken} = req.cookies;
            await service.logout(userId, refreshToken);
            res.clearCookie('refreshToken');
            res.json({});

        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    async refresh(req, res, next){
        try {
            const {userId} = req.body;
            const {refreshToken} = req.cookies;
            console.log(req.cookies);
            let answer = await service.refresh(userId, refreshToken);
            res.cookie('refreshToken', answer['tokens']['refresh'], {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            answer = answerModule.auth(answer);
            return res.json(answer);
        } catch (e) {
            next(e);
        }
    }

    async updateProfile(user, req, res, next){
        try {
            const {userNew} = req.body;
            console.log(1);
            await service.updateProfile(user, userNew);

            return res.json({});
        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    async getUser(user, req, res, next){
        try {
            console.log(124);
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new User();
