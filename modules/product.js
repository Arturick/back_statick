const request = require('request');
const axios = require('axios');
const apiError = require('../exeption/api-error');
const errorText = require('../src/answer').error;
const productService = require('../service/Product');
const userDB = require('../dto/user');
const productDB = require('../dto/product');

let answer = [];

class product{
    async seller(dateFrom, flag = false, type = 0, access, task1, article = false, date = false){
        if(!dateFrom){
            throw apiError.BadRequest(errorText.reqData);
        }
        let token = await userDB.getUserByTask1(task1);
        let lasUpdates = await userDB.getUserSaves(1, task1);
        token = token[0]['token'];
        console.log(lasUpdates);
        if(lasUpdates.length < 1){

            let response,
                totalPrice = 0,
                countProduct = 0,
                products = [];
            response = await axios.get(`https://suppliers-stats.wildberries.ru/api/v1/supplier/sales?dateFrom=${dateFrom}&flag=${flag}&key=${token}`)
            response.data.map(async i => {
                let date = String(i['date']).split('T')[0];
                products.push({});

                products[products.length - 1]['img'] = `https://images.wbstatic.net/c246x328/new/${String(i['supplierArticle']).slice(0, 4)}0000/${String(i['supplierArticle'])['supplierArticle']}-1.jpg`
                products[products.length - 1]['discount'] = i['discountPercent'];
                products[products.length - 1]['naming'] = i['subject'];
                products[products.length - 1]['brand'] = i['brand'];
                products[products.length - 1]['price'] += Math.round(+i['totalPrice']);
                products[products.length - 1]['article'] = i['supplierArticle'];
                products[products.length - 1]['date'] = date;
            });
            await productDB.addSeller(task1, products);
            await userDB.setUserSaves(task1, 1);
            answer.count = countProduct;
            answer.total = totalPrice;




        }
        let product = await productDB.getSeller(task1, type);
        let productList = product['products'];
        if(!article){
            productList.filter(i => i['article'] == article && i['date_seller'].split(' ')[0] == date.split(' ')[0]
            )
        }
        answer = {products: productList, total: product['total'], count: product['cnt']};
        return  answer;
    }

    async order(dateFrom, flag = false, type = 0, access, task1, article = false, date = false){
        if(!dateFrom){
            throw apiError.BadRequest(errorText.reqData);
        }
        let token = await userDB.getUserByTask1(task1);
        let lasUpdates = await userDB.getUserSaves (2, task1);
        token = token[0]['token'];
        if(lasUpdates.length < 1){
            let products = [];

            let response;
            response = await axios.get(`https://suppliers-stats.wildberries.ru/api/v1/supplier/orders?dateFrom=${dateFrom}&flag=0&key=${token}`)
            response.data.map(async i => {

                products.push({});
                products[products.length - 1]['img'] = `https://images.wbstatic.net/c246x328/new/${String(i['supplierArticle']).slice(0, 4)}0000/${String(i['supplierArticle'])}-1.jpg`
                products[products.length - 1]['price'] = Math.round(+i['totalPrice']);
                products[products.length - 1]['brand'] = i['brand'];
                products[products.length - 1]['naming'] = i['subject'];
                products[products.length - 1]['discountPercent'] = i['discountPercent'];
                products[products.length - 1]['article'] = i['supplierArticle'];
                products[products.length - 1]['date'] = String(i['date']).replace('T', ' ');


            });
            await productDB.addOrder(task1, products);
            await userDB.setUserSaves(task1, 2);
        }
        let product = await productDB.getOrder(task1, type);
        let productList = product['products'];
        if(!article){
            productList.filter(i => i['article'] == article && i['date_seller'].split(' ')[0] == date.split(' ')[0]
            )
        }
        answer = {products: productList, count: product['cnt'], total: product['total'],};
        return  answer;
    }

    async reportSeller(type, article = false, access, task1){
        if(!type){
            throw apiError.BadRequest(errorText.reqData);
        }

        let token = await userDB.getUserByTask1(task1);
        let lasUpdates = await userDB.getUserSaves( 3, task1);
        token = token[0]['token'];
        if(lasUpdates.length < 1){
            let products = [];

            let localDate = new Date(new Date().getTime() - (90 *86400000));
            let today = new Date();
            localDate = `${localDate.getFullYear()}-${localDate.getMonth()}-${localDate.getDate()}`;
            today= `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
            let response = await axios.get(`https://suppliers-stats.wildberries.ru/api/v1/supplier/reportDetailByPeriod?dateFrom=${localDate}&key=${token}&dateto=${today}`)
            response.data.map(async i => {
                products.push({});
                let nm_id = String(i['nm_id']);
                console.log(i);
                products[products.length - 1]['date'] = String(i['date_to']).replace('T', ' ').split(' ')[0];
                products[products.length - 1]['brand'] = i['brand_name'];
                products[products.length - 1]['article'] = nm_id;
                products[products.length - 1]['barcode'] = i['barcode'];
                products[products.length - 1]['countBuy'] = +i['delivery_amount'];
                products[products.length - 1]['countRetail'] = +i['return_amount'];
                products[products.length - 1]['priceRetail'] = +i['return_amount'] * (+i['retail_amount']);
                products[products.length - 1]['logic'] = i['delivery_rub'];
                products[products.length - 1]['priceBuy'] = +i['ppvz_for_pay'] * (+i['delivery_amount']);
                products[products.length - 1]['price'] = +i['ppvz_for_pay'];
                products[products.length - 1]['img'] = `https://images.wbstatic.net/c246x328/new/${nm_id.slice(0, 4)}0000/${nm_id}-1.jpg`
                products[products.length - 1]['discount'] = i['product_discount_for_report'];


            });
            await productDB.addAnalyze(task1, products);
            await userDB.setUserSaves(task1, 3);
        }
        let product = await productDB.getAnalyze(task1, type, article);
        answer = {products: product['products'], count: product['cnt'], total: product['total']};
        let response;



        return  answer;


    }

    async analyze(token, article){
        if(!article){
            throw apiError.BadRequest(errorText.reqData);
        }
        let product = await productService.findProductByArt(article);
        console.log(product);
        let description = product['description'] + product['naming'];
        let searchKeys = {};
        let answer = {product: product, search_keys: {}}
        for(let key1 of description.split(' ')){
            for(let key2 of description.split(' ')){

                let i = `${key1} ${key2}`;
                console.log(i);
                if(!searchKeys[i]){
                    searchKeys[i] = 1;
                } else {
                    searchKeys[i] +=1;
                }

            }
        }
        console.log(1);
        for(let i in searchKeys){
            if(+searchKeys[i] < 5){
                continue;
            }
            console.log(searchKeys);
            let pos = await productService.findProductByPos(article, i);
            answer.search_keys[i] = pos['pos'];
        }

        return answer;
    }

    async addMinusMoney(task1, type, value, access){
        if(!task1  | !type | !value){
            throw apiError.BadRequest(errorText.reqData);
        }

        //await productDB.
    }
}

module.exports = new product();