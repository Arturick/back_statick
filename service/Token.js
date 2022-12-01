const jwt = require('jsonwebtoken');
const tokenDB = require('../dto/token');


class Token {
    generateTokens(payload) {
        const accessToken = jwt.sign({payload: payload}, 'salt', {expiresIn: '24h'})
        const refreshToken = jwt.sign({payload: payload}, 'salt', {expiresIn: '48h'})
        return {
            access: accessToken,
            refresh: refreshToken
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, 'salt');
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, 'salt');
            return userData;
        } catch (e) {
            return null;
        }
    }

    async saveToken(task1, refreshToken) {
        const tokenData = await tokenDB.checkToken(task1, refreshToken);
        if (tokenData['cnt'] > 0) {
            return tokenData.updateToken(task1, refreshToken);
        }
        const token = await tokenDB.createToken(task1, refreshToken);
        return token;
    }

    async removeToken(task1, refreshToken) {
        const tokenData = await tokenDB.deleteToken(task1, refreshToken);
        return tokenData;
    }

    async findToken(task1, refreshToken) {
        const tokenData = await tokenDB.getToken(task1, refreshToken);
        return tokenData;
    }
}

module.exports = new Token();