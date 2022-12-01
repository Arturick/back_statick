const mysql         = require('mysql2');
const connection    = mysql.createPool({
    host : "31.31.198.237",
    database : "u0215623_front-tricks",
    user : "u0215623_front-tricks",
    password : "j6;ZeI7^3AHf"
}).promise();


class Token {
    async createToken(task1, refreshToken){
        console.log(refreshToken);
        let sqlScript = `INSERT INTO tokens (task1, time_token, token) VALUES (${task1}, NOW(), "${refreshToken}")`;
        let answer = await connection.query(sqlScript);

        return answer[0];
    }
    async checkToken(task1, token){
        let sqlScript = `SELECT COUNT(*) as cnt FROM tokens WHERE task1 = ${task1} AND token = "${token}"`;
        let answer = await connection.query(sqlScript);

        return answer[0];
    }
    async deleteToken(task1, refreshToken){
        let sqlScript = `DELETE FROM tokens WHERE task1 = ${task1} AND token = "${refreshToken}"`;
        let answer = await connection.query(sqlScript);

        return answer[0];
    }

    async getToken(task1, refreshToken){
        let sqlScript = `SELECT * FROM tokens WHERE task1 = ${task1} AND token = "${refreshToken}"`;
        let answer = await connection.query(sqlScript);

        return answer[0];
    }

    async updateToken(task1, refreshToken){
        let sqlScript = `UPDATE token SET tokens = "${refreshToken}" WHERE task1 = ${task1}`

        let answer = await connection.query(sqlScript);

        return answer[0];
    }
}

module.exports = new Token()