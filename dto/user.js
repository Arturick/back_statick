const mysql         = require('mysql2');
const connection    = mysql.createPool({
    host : "31.31.198.237",
    database : "u0215623_front-tricks",
    user : "u0215623_front-tricks",
    password : "j6;ZeI7^3AHf"
}).promise();

class User {
    async register(task1, login, email, password){
        let sqlScript = `INSERT INTO user(task1, name, email, password) VALUES (${task1}, ${login}, ${email}, ${password})`;
        await connection.query(sqlScript);

    }
    async login(login, password){
        let sqlScript = `SELECT COUNT(*) as cnt FROM user t WHERE t.name = "${login}" AND password = '${password}'`;
        let answer = await connection.query(sqlScript);

        return answer[0];
    }

    async updateProfile(task1, profile){
        let sqlScript = `UPDATE user t SET t.name = "${profile['name']}", surname = '${profile['surname']}', token = '${profile['token']}'`

        let answer = await connection.query(sqlScript);
    }
    async getUserByEmail(email){
        let sqlScript = `SELECT COUNT(*) as cnt FROM user WHERE email = '${email}'`
        let answer = await connection.query(sqlScript);

        return answer[0]
    }
    async getUserByTask1(task1){
        let sqlScript = `SELECT *  FROM user WHERE task1 = ${task1}`
        let answer = await connection.query(sqlScript);

        return answer[0]
    }

    async getUserByLogin(login){
        let sqlScript = `SELECT *  FROM user t WHERE t.name = "${login}"`
        let answer = await connection.query(sqlScript);

        return answer[0]
    }

    async getUserSaves(task1, type){
        let sqlScript = `SELECT *  FROM update_data t WHERE task1 = "${task1}" AND t.type = ${type}`;
        let answer = await connection.query(sqlScript);
        return answer[0];
    }

    async setUserSaves(task1, type){
        let sqlScript = `INSERT INTO update_data (type, task1, update_date) VALUES (${task1}, ${type}, NOW())`;
        let answer = await connection.query(sqlScript);

        return answer[0];
    }

    async deleteUserSaves(task1){
        let sqlScript = `DELETE update_data WHERE task1 = ${task1}`;
        let answer = await connection.query(sqlScript);

        return answer[0];
    }

    async getAll(){
        let sqlScript = `SELECT * FROM \`user\` `;
        let answer = await connection.query(sqlScript);

        return answer[0];
    }

    async refreshUserProduct(task1){
        let sqlScript = `DELETE FROM update_data WHERE \`type\` = ${task1}`;
        await connection.query(sqlScript);
        sqlScript = `DELETE FROM \`order\` WHERE task1 = ${task1}`;
        await connection.query(sqlScript);
        sqlScript = `DELETE FROM \`seller\` WHERE task1 = ${task1}`;
        await connection.query(sqlScript);
        sqlScript = `DELETE FROM \`analyze\` WHERE task1 = ${task1}`;
        await connection.query(sqlScript);
    }

}

module.exports = new User();