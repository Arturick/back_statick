const mysql         = require('mysql2');
const connection    = mysql.createPool({
    host : "31.31.198.237",
    database : "u0215623_front-tricks",
    user : "u0215623_front-tricks",
    password : "j6;ZeI7^3AHf"
}).promise();

class User {
    async register(task1, login, email, password){
        let sqlScript = `INSERT INTO user(task1, login, email, password) VALUES (${task1}, '${login}', '${email}', ${password})`;
        await connection.query(sqlScript);

    }
    async login(login, password){
        let sqlScript = `SELECT * FROM \`user\` t WHERE login = "${login}" AND password = "${password}"`;
        let answer = await connection.query(sqlScript);
        return answer[0];
    }

    async updateProfile(userId, profile){
        let sqlScript = `UPDATE user t SET t.name = "${profile['name']}", surname = '${profile['surname']}', token = '${profile['token']}', password = '${profile['password']}', login = '${profile['login']}' WHERE id = ${userId}`
        await connection.query(sqlScript);
    }
    async getUserByEmail(email){
        let sqlScript = `SELECT * FROM user WHERE email = '${email}'`
        let answer = await connection.query(sqlScript);

        return answer[0]
    }
    async getUserByLogin(login){
        let sqlScript = `SELECT * FROM user WHERE login = '${login}'`
        console.log(sqlScript);
        let answer = await connection.query(sqlScript);

        return answer[0]
    }
    async getUserByTask1(task1){
        let sqlScript = `SELECT *  FROM user WHERE task1 = ${task1}`
        let answer = await connection.query(sqlScript);

        return answer[0]
    }


    async getUserSaves(userId, type){
        let sqlScript = `SELECT *  FROM update_data t WHERE userId = ${userId} AND t.type = ${type}`;
        let answer = await connection.query(sqlScript);
        return answer[0];
    }

    async setUserSaves(userId, type){
        let sqlScript = `INSERT INTO update_data (type, userId, update_date) VALUES (${userId}, ${type}, NOW())`;
        let answer = await connection.query(sqlScript);

        return answer[0];
    }

    async deleteUserSaves(userId){
        let sqlScript = `DELETE FROM update_data WHERE userId = ${userId}`;
        let answer = await connection.query(sqlScript);

        return answer[0];
    }

    async getAll(){
        let sqlScript = `SELECT * FROM \`user\` `;
        let answer = await connection.query(sqlScript);

        return answer[0];
    }

    async refreshUserProduct(task1, type) {
        let sqlScript = ``;
        if(type == 1){
            sqlScript = `DELETE FROM update_data WHERE \`type\` = ${task1} AND userId = 1`;
            await connection.query(sqlScript);
            sqlScript = `DELETE FROM \`seller\` WHERE task1 = ${task1}`;
            await connection.query(sqlScript);
        } else if(type == 2){
            sqlScript = `DELETE FROM update_data WHERE \`type\` = ${task1} AND userId = 2`;
            await connection.query(sqlScript);
            sqlScript = `DELETE FROM \`order\` WHERE task1 = ${task1}`;
            await connection.query(sqlScript);
        } else {
            sqlScript = `DELETE FROM update_data WHERE \`type\` = ${task1} AND userId = 3`;
            await connection.query(sqlScript);
            sqlScript = `DELETE FROM \`analyze\` WHERE task1 = ${task1}`;
            await connection.query(sqlScript);
        }


    }

    async getUserById(id) {
        let sqlScript = `SELECT * FROM user WHERE id = ${id}`;

        let answer = await connection.query(sqlScript);

        if (answer[0].length < 0) {
            throw Error('user not found')
        }
        return answer[0][0];
    }

}

module.exports = new User();