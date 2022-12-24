const mysql         = require('mysql2');
const connection    = mysql.createPool({
    host : "31.31.198.237",
    database : "u0215623_front-tricks",
    user : "u0215623_front-tricks",
    password : "j6;ZeI7^3AHf"
}).promise();


class Token {
    async createToken(userId, refreshToken){
        console.log(refreshToken);
        let sqlScript = `INSERT INTO tokens (userId, time_token, token) VALUES (${userId}, NOW(), "${refreshToken}")`;
        let answer = await connection.query(sqlScript);

        return answer[0];
    }
    async checkToken(userId){
        let sqlScript = `SELECT * FROM tokens WHERE userId = ${userId}`;
        let answer = await connection.query(sqlScript);

        return answer[0];
    }

    async deleteTokenById(userId){
        let sqlScript = `DELETE FROM tokens WHERE userId = ${userId}`;
        await connection.query(sqlScript);
    }

    async getToken(userId){
        let sqlScript = `SELECT * FROM tokens WHERE userId = ${userId}`;
        let answer = await connection.query(sqlScript);

        return answer[0];
    }

}

module.exports = new Token()