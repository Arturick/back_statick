const jwt = require('jsonwebtoken');
const tokenDB = require('../dto/token');
const salt_config = require('../src/config').jwt;

class Token {
    generateTokens(userId) {
        const accessToken = jwt.sign({payload: userId}, salt_config.accessSalt, {expiresIn: '24h'})
        const refreshToken = jwt.sign({payload: userId}, salt_config.refreshSalt, {expiresIn: '148h'})
        return {
            access: accessToken,
            refresh: refreshToken
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, salt_config.accessSalt);
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, salt_config.refreshSalt);
            return userData;
        } catch (e) {
            return null;
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await tokenDB.checkToken(userId);
        console.log(tokenData);
        if (tokenData.length > 0) {
            await tokenDB.deleteTokenById(userId);
        }
        const token = await tokenDB.createToken(userId, refreshToken);
        return token;
    }

    async removeToken(userId) {
        const tokenData = await tokenDB.deleteTokenById(userId);
        return tokenData;
    }

    async findToken(userId) {
        const tokenData = await tokenDB.getToken(userId);
        if(tokenData.length < 1){
            return null
        }
        return tokenData[0];
    }
}

module.exports = new Token();