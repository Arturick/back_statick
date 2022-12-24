const apiError = require('../exeption/api-error');
const errorText = require('../src/answer').error;
const tokenService = require('../service/Token');
const userDB = require('../dto/user');

class User {
    async register(login, email, password) {
        if (!login || !email || !password) {
            throw apiError.BadRequest(errorText.reqData);
        }
        let isAlreadyReg = await userDB.getUserByEmail(email);
        let isAlreadyLog = await userDB.getUserByLogin(login);
        if (isAlreadyReg.length > 0 || isAlreadyLog.length > 0) {
            throw apiError.BadRequest('данный емэил или логин уже зарегестрирован');
        }
        let task1 = Math.floor(Math.random() * (1000000000000 - 1000000000)) + 1000000000;
        await userDB.register(task1, login, email, password);
        isAlreadyLog = await userDB.getUserByLogin(login);
        let answer = {
            id: isAlreadyLog[0]['id'],

            tokens: await tokenService.generateTokens(task1),
        }
        await tokenService.saveToken(isAlreadyLog[0]['id'], answer.tokens.refresh);
        return answer;
    }

    async login(login, password){
        if(!login || !password){
            throw apiError.BadRequest(errorText.reqData);
        }
        let isLog = await userDB.login(login, password);
        if (isLog.length < 1) {
            throw apiError.BadRequest('Не верные данные');
        }

        let userId = isLog[0]['id'];
        console.log(isLog[0]['id']);
        let answer = {
            userId: userId,

            tokens: await tokenService.generateTokens(userId),
        }
        await tokenService.saveToken(userId, answer.tokens.refresh);
        return answer;

    }

    async logout(userId){
        if(userId){
            throw apiError.BadRequest(errorText.reqData);
        }
        await tokenService.removeToken(userId);
        return {};
    }

    async refresh(userId, refreshToken){
        console.log(refreshToken, userId);
        if((!userId && userId !=0) || !refreshToken){
            throw apiError.BadRequest(errorText.reqData);
        }
        let isToken = tokenService.findToken(userId);
        if(!isToken){
            throw apiError.BadRequest(errorText.errorToken);
        }
        isToken = tokenService.validateRefreshToken(refreshToken);
        console.log(isToken);
        if(!isToken || isToken.payload != userId){
            throw apiError.BadRequest('Нужно войти в профиль');
        }
        let answer = {
            userId: userId,
            tokens: await tokenService.generateTokens(userId),
        }
        await tokenService.saveToken(userId, answer.tokens.refresh);

        return answer;
    }

    async updateProfile(user, userNew){
        if(!user  || !userNew){
            throw apiError.BadRequest(errorText.reqData);
        }

        await userDB.updateProfile(user['id'], userNew);
        console.log(11)
        if(userNew.token != user.token){
            await userDB.deleteUserSaves(user['id']);
        }
        return {};
    }

    async getProfile(task1, access){

        if(!task1){
            throw apiError.BadRequest(errorText.reqData);
        }
        let isLog = tokenService.validateAccessToken(access)
        console.log(isLog.payload);
        if(isLog.payload != task1){
            throw apiError.BadRequest(errorText.reqData);
        }
        let profile = await userDB.getUserByTask1(task1);
        return profile;
    }
}

module.exports = new User();