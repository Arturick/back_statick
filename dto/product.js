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
    3: 168,
    4: 1950
}

class Product {
    async addOrder(task1, products){
        let sqlScript = ``;
        await this.clear(task1, 2);
        for(let i of products){
            let img = `https://images.wbstatic.net/c246x328/new/${Math.floor(+i['nmId'] / 10000)}0000/${String(i['nmId'])}-1.jpg`;
            sqlScript = `INSERT INTO \`order\` (brand, task1, article, discount, price, naming, date_seller, retail_price, img, srid, barcode, category, size, region, pwz) VALUES('${i['brand']}', ${task1}, '${i['nmId']}', '${i['discountPercent']}', '${Math.round(+i['totalPrice'])}', '${i['subject']}', '${String(i['date']).replace('T', ' ')}', '${Math.round(+i['totalPrice'])}', '${img}', '${i['srid']}', '${i['barcode']}', '${i['category']}', '${i['techSize']}', '${i['oblast']}', '${i['warehouseName']}')`
            await connection.query(sqlScript);

        }



    }
    async addSeller(task1, products){
        let sqlScript = ``;
        await this.clear(task1, 1);
        for(let i of products){
            let date = String(i['date']).split('T')[0];
            let img = `https://images.wbstatic.net/c246x328/new/${Math.floor(+i['nmId'] / 10000)}0000/${+i['nmId']}-1.jpg`;
            sqlScript = `INSERT INTO seller (brand, task1, article, discount, price, naming, date_seller, retail_price, img, srid, barcode, category, size, region, pwz) VALUES('${i['brand']}', ${task1}, '${i['nmId']}', '${i['discountPercent']}', ${i['forPay']}, '${i['subject']}', '${date}', ${i['forPay']}, '${img}', '${i['srid']}', '${i['barcode']}', '${i['category']}', '${i['techSize']}', '${i['oblast']}', '${i['warehouseName']}')`;
            await connection.query(sqlScript);

        }
    }
    async  addAnalyze(task1, products){
        let sqlScript = ``;
        await this.clear(task1, 3);
        for(let i of products){
            let nm_id = String(i['nm_id']);
            let img = `https://images.wbstatic.net/c246x328/new/${Math.floor(+nm_id / 10000)}0000/${nm_id}-1.jpg`;
            sqlScript = `INSERT INTO \`analyze\` (brand, task1, article, discount, price, naming, date_report, retail_price, img, count_report, total_price, barcode, size_product, retail_count, logic, com_wb, penalty, owner_article,  count_buy, srid) VALUES('${i['brand_name']}', ${task1}, '${nm_id}', ${i['product_discount_for_report']}, ${+i['retail_price'] - ((+i['retail_price'] * i['product_discount_for_report']) / 100)}, '${i['naming']}', ${String(i['date_to']).replace('T', ' ').split(' ')[0]}, ${+i['return_amount']}, '${img}', 1, ${+i['retail_price']}, '${i['barcode']}', '${i['ts_name']}',   ${+i['return_amount']}, ${i['delivery_rub']}, 1000, ${i['penalty']}, '${i['sa_name']}', ${+i['quantity']}, '${i['srid']}')`;
            await connection.query(sqlScript);
        }
    }

    async getAnalyze(task1, type, article = false){
        let sqlScript = `SELECT *, COUNT(*) as cnt, SUM(price) as total FROM \`analyze\` t WHERE task1 = ${task1}  GROUP by article, date_report`;
        if(article != false){
            sqlScript = `SELECT *, COUNT(*) as cntBuy, SUM(price) as totalBuy , SUM(retail_price) as rtp, SUM(retail_count) as countRetail,  SUM(price), SUM(logic) as lg, SUM(penalty) as pnt FROM \`analyze\` WHERE article = ${article}`
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
    async getOrderGraph(task1, article){
        console.log(article);
        let sqlScript = `SELECT *, COUNT(*) as cnt, SUM(price) as total FROM \`order\` WHERE task1 = ${task1} and date_seller > DATE_SUB(NOW(), INTERVAL ${dataType[3]} HOUR) GROUP by date_seller`;

        if(article){
            sqlScript = `SELECT *, COUNT(*) as cnt, SUM(price) as total FROM \`order\` WHERE task1 = ${task1} and article = '${article}' and date_seller > DATE_SUB(NOW(), INTERVAL ${dataType[4]} HOUR) GROUP by date_seller`;

        }
        let answer = {};
        answer['products'] = await connection.query(sqlScript);

        //answer['cnt'] = await connection.query(`SELECT COUNT(*) as cnt FROM \`order\` t WHERE task1 = ${task1} and date_seller  > DATE_SUB(NOW(), INTERVAL ${dataType[3]} HOUR)`);
        //answer['total'] = await connection.query(`SELECT SUM(price) as cnt FROM \`order\` t WHERE task1 = ${task1} and date_seller  > DATE_SUB(NOW(), INTERVAL ${dataType[3]} HOUR)`);
        //answer['total'] = answer['total'][0];
        answer['products'] = answer['products'][0];
        //answer['cnt'] = answer['cnt'][0];
        return answer;
    }
    async getSellerGraph(task1, article){
        let sqlScript = `SELECT *, COUNT(*) as cnt, SUM(price) as total FROM \`seller\` WHERE task1 = ${task1} and date_seller > DATE_SUB(NOW(), INTERVAL ${dataType[3]} HOUR) GROUP by date_seller`;
        let answer = {};
        if(article){
            sqlScript = `SELECT *, COUNT(*) as cnt, SUM(price) as total FROM \`seller\` WHERE task1 = ${task1} and article = '${article}' and date_seller > DATE_SUB(NOW(), INTERVAL ${dataType[4]} HOUR) GROUP by date_seller`;

        }
        answer['products'] = await connection.query(sqlScript);
        answer['cnt'] = await connection.query(`SELECT COUNT(*) as cnt FROM \`order\` t WHERE task1 = ${task1} and date_seller  > DATE_SUB(NOW(), INTERVAL ${dataType[4]} HOUR)`);
        answer['total'] = await connection.query(`SELECT SUM(price) as cnt FROM \`order\` t WHERE task1 = ${task1} and date_seller  > DATE_SUB(NOW(), INTERVAL ${dataType[4]} HOUR)`);
        answer['total'] = answer['total'][0];
        answer['products'] = answer['products'][0];
        answer['cnt'] = answer['cnt'][0];
        return answer;
    }
    async getEconomyAll(task1){
        let sqlScript = `SELECT *, COUNT(*) as cntBuy, SUM(price) as totalBuy , SUM(retail_price) as rtp, SUM(retail_count) as countRetail,  SUM(price), SUM(logic) as lg, SUM(penalty) as pnt FROM \`analyze\` WHERE task1 = ${task1} GROUP by article`

        let answer = await connection.query(sqlScript);
        return answer[0];
    }
    async abcGet(task1){
        let sqlScript = `SELECT *, SUM(count_buy) as cnt FROM \`analyze\`  WHERE task1 = ${task1} GROUP by article`;
        let answer = await connection.query(sqlScript);
        return answer[0];
    }
    async getTotalPriceAnalyze(task1){
        let sqlScript = `SELECT *, SUM(count_buy) as cnt  FROM \`analyze\` WHERE task1 = ${task1} GROUP by article`;
        let answer = await connection.query(sqlScript),
            total = 0;
        answer[0].map(i => {
            total += i['cnt'] * i['price'];
        });

        return total;
    }
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
    async getByArticleDateSeller(task1, article, date){
        let sqlScript = `SELECT * FROM \`seller\` WHERE task1=${task1} AND article = '${article}'`;
        let answer = await connection.query(sqlScript);

        return answer[0]
    }
    async getByArticleDateOrder(task1, article, date){
        let sqlScript = `SELECT * FROM \`order\` WHERE task1=${task1} AND article = '${article}'`;
        let answer = await connection.query(sqlScript);
        return answer[0];
    }

    async getSellerAll(task1){
        let sqlScript = `SELECT * FROM \`seller\` WHERE task1 = ${task1}`;
        let answer = await connection.query(sqlScript);

        return answer[0];
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
    async getByArticleSeller(artice){
        let sqlScript = `SELECT *, COUNT(*) as cnt FROM seller WHERE article = '${artice}'`;
        let answer = await  connection.query(sqlScript);
        return answer[0][0];
    }
    async getByArticleOrder(artice){
        let sqlScript = `SELECT *, COUNT(*) as cnt FROM \`order\` WHERE article = '${artice}'`;
        let answer = await  connection.query(sqlScript);
        return answer[0][0];
    }
    async getByArticleAnalyze(artice){
        let sqlScript = `SELECT *, COUNT(*) as cnt FROM seller WHERE article = '${artice}'`;
        let answer = await  connection.query(sqlScript);
        return answer[0][0];
    }

    async getMinus(task1){
        let sqlScript = `SELECT * FROM minus WHERE task1=  ${task1}`;
        let answer = await connection.query(sqlScript);
        return answer[0];
    }

    async addMinus(task1, value, isNumber, allTime, old, naming, percent){
        let sqlScript = `INSERT INTO minus(old, date_add, \`value\`, isNumber, allTime, task1, naming, percent) VALUES (${old}, NOW(), ${value}, ${isNumber}, ${allTime}, ${task1}, '${naming}', ${percent})`;
        let answer = await connection.query(sqlScript);
    }

    async deleteMinus(user){
        let sqlScript = `DELETE FROM minus WHERE task1 = ${user['task1']}`;
        await connection.query(sqlScript);
    }

    async getAllSellerDiagram(task1){
        let sqlScript = `SELECT COUNT(*) as cnt, SUM(price) as totalPr FROM \`seller\` WHERE task1 = ${task1}`;
        let answer = await connection.query(sqlScript);
        return answer[0];
    }

    async getBySrid(srid){
        let sqlScript = `SELECT * FROM \`seller\` WHERE srid = '${srid}'`;
        let answer = await connection.query(sqlScript);
        return answer[0];
    }

    async getAllOrderDiagram(task1){
        let sqlScript = `SELECT COUNT(*) as cnt, SUM(price) as totalPr FROM \`order\` WHERE task1 = ${task1}`;
        let answer = await connection.query(sqlScript);
        return answer[0];
    }

    async getAllOrder(task1){
        let sqlScript = `SELECT * FROM \`order\` WHERE task1 = ${task1}`;
        let answer = await connection.query(sqlScript);
        return answer[0];
    }

    async getAllRetail(task1){
        let sqlScript = `SELECT COUNT(*) as cnt, SUM(penalty) as prt FROM \`analyze\` WHERE task1 = ${task1} AND retail_count != 0`;

        let answer = await connection.query(sqlScript);

        return answer[0];
    }
}

module.exports = new Product();