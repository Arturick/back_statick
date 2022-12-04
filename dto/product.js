const mysql         = require('mysql2');
const connection    = mysql.createPool({
    host : "31.31.198.237",
    database : "u0215623_front-tricks",
    user : "u0215623_front-tricks",
    password : "j6;ZeI7^3AHf"
}).promise();

const dataType = {

    1: 24,
    2: 24,
    3: 128,
    4: 1950
}

class Product {
    async addOrder(task1, products){
        let sqlScript = ``;
        await this.clear(task1, 2);
        for(let i of products){
            sqlScript = `INSERT INTO \`order\` (brand, task1, article, discount, price, naming, date_seller, retail_price, img) VALUES('${i['brand']}', ${task1}, '${i['article']}', '${i['discount']}', '${i['price']}', '${i['naming']}', '${i['date']}', '${i['price']}', '${i['img']}')`
            await connection.query(sqlScript);

        }



    }
    async addSeller(task1, products){
        let sqlScript = ``;
        await this.clear(task1, 1);
        for(let i of products){
            sqlScript = `INSERT INTO seller (brand, task1, article, discount, price, naming, date_seller, retail_price, img, penalty) VALUES('${i['brand']}', ${task1}, '${i['article']}', '${i['discount']}', '${i['price']}', '${i['naming']}', '${i['date']}', '${i['price']}', '${i['img']}', ${i['penalty']})`
            await connection.query(sqlScript);

        }
    }
    async  addAnalyze(task1, products){
        let sqlScript = ``;
        await this.clear(task1, 3);
        for(let i of products){
            sqlScript = `INSERT INTO \`analyze\` (brand, task1, article, discount, price, naming, date_report, retail_price, img, count_report, total_price, barcode, size_product, retail_count, logic, com_wb) VALUES('${i['brand']}', ${task1}, '${i['article']}', ${i['discount']}, ${i['price']}, '${i['naming']}', ${i['date']}, ${i['price']}, '${i['img']}', 1, ${i['priceBuy']}, ${i['barcode']}, '${i['size']}',   ${i['countRetail']}, ${i['logic']}, 1000)`;
            await connection.query(sqlScript);

        }
    }
    async getAnalyze(task1, type, article = false){
        let sqlScript = `SELECT *, COUNT(*) as cnt, SUM(price) as total FROM \`analyze\` t WHERE task1 = ${task1}  GROUP by article, date_report`;
        if(article != false){
            sqlScript = `SELECT COUNT(*), brand, img, article, barcode, size_product, price, retail_price, SUM(total_price) as totalBuy , SUM(retail_price), SUM(retail_count) as countRetail, SUM(price), SUM(penalty) FROM \`analyze\` WHERE article = ${article}`
        }
        let answer = {};
        answer['products'] = await connection.query(sqlScript);
        answer['cnt'] = await connection.query(`SELECT COUNT(*) as cnt FROM \`analyze\` t WHERE task1 = ${task1} and date_report  > DATE_SUB(NOW(), INTERVAL ${dataType[type]} HOUR)`);
        answer['total'] = await connection.query(`SELECT SUM(price) as cnt FROM \`analyze\` t WHERE task1 = ${task1} and date_report  > DATE_SUB(NOW(), INTERVAL ${dataType[type]} HOUR)`);
        answer['total'] = answer['total'][0];
        answer['products'] = answer['products'][0];
        answer['cnt'] = answer['cnt'][0];
        return answer;
    }
    async getSeller(task1, type){
        let sqlScript = `SELECT *, COUNT(*) as cnt, SUM(price) as total FROM seller WHERE task1 = ${task1} and date_seller > DATE_SUB(NOW(), INTERVAL ${dataType[type]} HOUR) GROUP by article, date_seller`;
        let answer = {};
        answer['products'] = await connection.query(sqlScript);
        answer['cnt'] = await connection.query(`SELECT COUNT(*) as cnt FROM seller t WHERE task1 = ${task1} and date_seller  > DATE_SUB(NOW(), INTERVAL ${dataType[type]} HOUR)`);
        answer['total'] = await connection.query(`SELECT SUM(price) as cnt FROM seller t WHERE task1 = ${task1} and date_seller  > DATE_SUB(NOW(), INTERVAL ${dataType[type]} HOUR)`);
        answer['total'] = answer['total'][0];
        answer['products'] = answer['products'][0];
        answer['cnt'] = answer['cnt'][0];
        return answer;
    }
    async getOrder(task1, type){
        let sqlScript = `SELECT *, COUNT(*) as cnt, SUM(price) as total FROM \`order\` WHERE task1 = ${task1} and date_seller > DATE_SUB(NOW(), INTERVAL ${dataType[type]} HOUR) GROUP by article, date_seller`;
        let answer = {};
        answer['products'] = await connection.query(sqlScript);
        answer['cnt'] = await connection.query(`SELECT COUNT(*) as cnt FROM \`order\` t WHERE task1 = ${task1} and date_seller  > DATE_SUB(NOW(), INTERVAL ${dataType[type]} HOUR)`);
        answer['total'] = await connection.query(`SELECT SUM(price) as cnt FROM \`order\` t WHERE task1 = ${task1} and date_seller  > DATE_SUB(NOW(), INTERVAL ${dataType[type]} HOUR)`);
        answer['total'] = answer['total'][0];
        answer['products'] = answer['products'][0];
        answer['cnt'] = answer['cnt'][0];
        return answer;
    }
    // async addMinus(task1, value, type){
    //     let
    // }

    async getAnalyzeProduct(article){
        let sqlScript = `SELECT *, COUNT(*) as cnt, SUM(price) FROM seller WHERE article = ${article}`;
        let answer = await connection.query(sqlScript);
        return answer[0];
    }
    async clear(task1, type){
        let sqlScript = ``;
        switch (type) {
            case 1:
                sqlScript = `DELETE FROM seller WHERE task1 = ${task1}`;
                break;
            case 2:
                sqlScript = `DELETE FROM "order" WHERE task1 = ${task1}`;
                break;
            case 3:
                sqlScript = `DELETE FROM analyze WHERE task1 = ${task1}`;
                break;
        }
    }

    async getAnalyzeGraphSeller(article){
        let sqlScript = `SELECT COUNT(*) as cnt, date_seller FROM seller WHERE article = ${article} GROUP by date_seller`;
        let answer = await connection.query(sqlScript);
        return answer[0];
    }

    async getAnalyzeGraphOrder(article){
        let sqlScript = `SELECT COUNT(*) as cnt, date_seller FROM \`order\` WHERE article = ${article} GROUP by date_seller`;
        let answer = await connection.query(sqlScript);
        return answer[0];
    }
}

module.exports = new Product();