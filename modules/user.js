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
        if (isAlreadyReg[0]['cnt'] > 0) {
            throw apiError.BadRequest(errorText.emailAlreadyReg);
        }
        let task1 = Math.floor(Math.random() * (1000000000000 - 1000000000)) + 1000000000;
        await userDB.register(task1, login, email, password);
        let answer = {
            profile: await userDB.getUserByTask1(task1),

            tokens: await tokenService.generateTokens(task1),
        }
        await tokenService.saveToken(task1, answer.tokens.refresh);
        return answer;
    }

    async login(login, password){
        if(!login || !password){
            throw apiError.BadRequest(errorText.reqData);
        }
        let isLog = await userDB.login(login, password);
        if (isLog[0]['cnt'] < 0) {
            throw apiError.BadRequest(errorText.emailAlreadyReg);
        }

        let user = await userDB.getUserByLogin(login);
        let task1 = user[0]['task1'];
        console.log(user[0]['task1']);
        let answer = {
            profile: user,

            tokens: await tokenService.generateTokens(task1),
        }
        await tokenService.saveToken(task1, answer.tokens.refresh);
        return answer;

    }

    async logout(task1, refreshToken){
        if(!task1 || !refreshToken){
            throw apiError.BadRequest(errorText.reqData);
        }
        await tokenService.removeToken(task1, refreshToken);
    }

    async refresh(task1, refreshToken){
        if(!task1 || !refreshToken){
            throw apiError.BadRequest(errorText.reqData);
        }
        let isToken = tokenService.findToken(task1, refreshToken);
        if(isToken.length < 1){
            throw apiError.BadRequest(errorText.errorToken);
        }
        let user = await userDB.getUserByTask1(task1);
        let answer = {
            profile: user,

            tokens: await tokenService.generateTokens(task1),
        }
        await tokenService.saveToken(task1, answer.tokens.refresh);

        return answer;
    }

    async updateProfile(task1, profile, access){
        if(!task1 || !profile || !access){
            throw apiError.BadRequest(errorText.reqData);
        }
        let isLog = tokenService.validateAccessToken(access);
        console.log(isLog);
        if(isLog.payload != +task1){
            throw apiError.BadRequest(errorText.reqData);
        }
        await userDB.updateProfile(task1, profile);

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