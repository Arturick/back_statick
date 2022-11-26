const request = require('request');
const axios = require('axios');
const apiError = require('../exeption/api-error');
const errorText = require('../src/answer').error;

let answer = [];

class product{
    async seller(token,dateFrom, flag = false, type = 0){
        if(!token || !dateFrom){
            throw apiError.BadRequest(errorText.reqData);
        }
        console.log(dateFrom);
        console.log(type);
        console.log(flag);
        answer = {count: 0, total: 0, products: {}};
        let response,
            totalPrice = 0,
            countProduct = 0;
        response = await axios.get(`https://suppliers-stats.wildberries.ru/api/v1/supplier/sales?dateFrom=${dateFrom}&flag=${flag}&key=${token}`)
        response.data.map(i => {
            let date = String(i['date']).split('T')[0];
            if(flag == '1'){
                if(!answer.products[i['supplierArticle']]){
                    answer.products[i['supplierArticle']] = {};
                    answer.products[i['supplierArticle']]['count'] = 0;
                    answer.products[i['supplierArticle']]['price'] = 0;
                }

                answer.products[i['supplierArticle']]['img'] = `https://images.wbstatic.net/c246x328/new/${i['supplierArticle'].slice(0, 4)}0000/${i['supplierArticle']}-1.jpg`
                answer.products[i['supplierArticle']]['discountPercent'] = i['discountPercent'];
                answer.products[i['supplierArticle']]['naming'] = i['subject'];
                answer.products[i['supplierArticle']]['brand'] = i['brand'];
                answer.products[i['supplierArticle']]['price'] += Math.round(+i['priceWithDisc']);
                answer.products[i['supplierArticle']]['count'] += 1;

            } else {
                if(type == 3){
                    if(new Date().getTime() - (86400000 * 7) > new Date(date).getTime()){
                        return;
                    }
                }    else if(type == 4){
                    if(new Date().getTime() - (86400000 * 30) > new Date(date).getTime()){
                        return;
                    }
                }


                if(!answer.products[i['supplierArticle']]){
                    answer.products[i['supplierArticle']] = {}
                }
                if(!answer.products[i['supplierArticle']][date]){
                    answer.products[i['supplierArticle']][date] = {};
                    answer.products[i['supplierArticle']][date]['count'] = 0;
                    answer.products[i['supplierArticle']][date]['price'] = 0;
                }


                answer.products[i['supplierArticle']][date]['img'] = `https://images.wbstatic.net/c246x328/new/${i['supplierArticle'].slice(0, 4)}0000/${i['supplierArticle']}-1.jpg`
                answer.products[i['supplierArticle']][date]['discountPercent'] = i['discountPercent'];
                answer.products[i['supplierArticle']][date]['naming'] = i['subject'];
                answer.products[i['supplierArticle']][date]['date'] = String(i['date']).replace('T', ' ');
                answer.products[i['supplierArticle']][date]['article'] = i['supplierArticle'];
                answer.products[i['supplierArticle']][date]['brand'] = i['brand'];
                answer.products[i['supplierArticle']][date]['price'] += Math.round(+i['priceWithDisc']);
                answer.products[i['supplierArticle']][date]['count'] += 1;
                totalPrice += Math.round(+i['priceWithDisc']);
                countProduct +=1;
            }


        });
        answer.count = countProduct;
        answer.total = totalPrice;
        return  answer;
    }



    async order(token,dateFrom, flag = false, type = 0){
        if(!token || !dateFrom){
            throw apiError.BadRequest(errorText.reqData);
        }

        answer = {products: {}, count: 0, total: 0,};
        let response;
        response = await axios.get(`https://suppliers-stats.wildberries.ru/api/v1/supplier/orders?dateFrom=${dateFrom}&flag=0&key=${token}`)
        response.data.map(i => {
            let date = String(i['date']).split('T')[0];
            let el = {};
            if(flag == '1'){
                if(!answer.products[i['supplierArticle']]){
                    answer.products[i['supplierArticle']] = {};
                    answer.products[i['supplierArticle']]['count'] = 0;
                    answer.products[i['supplierArticle']]['price'] = 0;
                }

                answer.products[i['supplierArticle']]['img'] = `https://images.wbstatic.net/c246x328/new/${i['supplierArticle'].slice(0, 4)}0000/${i['supplierArticle']}-1.jpg`
                answer.products[i['supplierArticle']]['count'] += 1;
                answer.products[i['supplierArticle']]['price'] += Math.round(+i['totalPrice']);
            } else {
                if(type == 1){
                    if(new Date().getTime() - (86400000 * 7) > new Date(date).getTime()){
                        return;
                    }
                }    else if(type == 2){
                    if(new Date().getTime() - (86400000 * 30) > new Date(date).getTime()){
                        return;
                    }
                }
                if(!answer.products[i['supplierArticle']]){
                    answer.products[i['supplierArticle']] = {}
                }
                if(!answer.products[i['supplierArticle']][date]){
                    answer.products[i['supplierArticle']][date] = {};
                    answer.products[i['supplierArticle']][date]['count'] = 0;
                    answer.products[i['supplierArticle']][date]['price'] = 0;
                }
                answer.products[i['supplierArticle']][date]['img'] = `https://images.wbstatic.net/c246x328/new/${i['supplierArticle'].slice(0, 4)}0000/${i['supplierArticle']}-1.jpg`
                answer.products[i['supplierArticle']][date]['count'] += 1;
                answer.products[i['supplierArticle']][date]['price'] += Math.round(+i['totalPrice']);
                answer.products[i['supplierArticle']][date]['brand'] += i['brand'];
                answer.products[i['supplierArticle']][date]['naming'] += i['subject'];
                answer.products[i['supplierArticle']][date]['discountPercent'] = i['discountPercent'];
                answer.products[i['supplierArticle']][date]['article'] = i['supplierArticle'];
                answer.products[i['supplierArticle']][date]['date'] = String(i['date']).replace('T', ' ');
                answer.total += Math.round(+i['totalPrice']);
                answer.count +=1;
            }

        });

        return  answer;
    }



    async reportSeller(token,dateFrom,dateTo, article = false){
        if(!token || !dateFrom || !dateTo){
            throw apiError.BadRequest(errorText.reqData);
        }
        //https://suppliers-stats.wildberries.ru/api/v1/supplier/reportDetailByPeriod?dateFrom=2020-06-01&key=&limit=1000&rrdid=0&dateto=2022-12-30
        answer = {products: {}, count: 0, total: 0,};
        let response;

        response = await axios.get(`https://suppliers-stats.wildberries.ru/api/v1/supplier/reportDetailByPeriod?dateFrom=${dateFrom}&key=${token}&dateto=${dateTo}`)
        response.data.map(i => {
            let nm_id = String(i['nm_id']);
            console.log(article && nm_id == article);
            if(article){
                if(nm_id != article){
                    return 0;
                }
                if(!answer[nm_id]){
                    answer[nm_id] = {countBuy: 0, priceBuy: 0, countRetail: 0, priceRetail: 0, report: 0};
                }
                answer[nm_id]['brand'] = i['brand_name'];
                answer[nm_id]['nm_id'] = nm_id;
                answer[nm_id]['barcode'] = i['barcode'];
                answer[nm_id].countBuy += +i['delivery_amount'];
                answer[nm_id].countRetail += +i['return_amount'];
                answer[nm_id].priceRetail += +i['return_amount'] * (+i['retail_amount']);
                answer[nm_id]['logic'] = i['delivery_rub'];
                answer[nm_id].priceBuy += +i['ppvz_for_pay'] * (+i['delivery_amount']);
                answer[nm_id]['price'] += +i['ppvz_for_pay'];
                answer[nm_id]['img'] = `https://images.wbstatic.net/c246x328/new/${nm_id.slice(0, 4)}0000/${nm_id}-1.jpg`
                answer[nm_id]['discount'] = i['product_discount_for_report'];
            } else {
                if(!answer[nm_id]){
                    answer[nm_id] = {countBuy: 0, priceBuy: 0, countRetail: 0, priceRetail: 0, report: 0};
                }
                answer[nm_id]['brand'] = i['brand_name'];
                answer[nm_id]['nm_id'] = nm_id;
                answer[nm_id]['barcode'] = i['barcode'];
                answer[nm_id].countBuy += +i['delivery_amount'];
                answer[nm_id].countRetail += +i['return_amount'];
                answer[nm_id].priceRetail += +i['return_amount'] * (+i['retail_amount']);
                answer[nm_id]['logic'] = i['delivery_rub'];
                answer[nm_id].priceBuy += +i['ppvz_for_pay'] * (+i['delivery_amount']);
                answer[nm_id]['price'] += +i['retail_amount'];
                answer[nm_id]['img'] = `https://images.wbstatic.net/c246x328/new/${nm_id.slice(0, 4)}0000/${nm_id}-1.jpg`
                answer[nm_id]['discount'] = i['product_discount_for_report'];
                //product_discount_for_report


            }
        })

        return  answer;


    }
}

module.exports = new product();