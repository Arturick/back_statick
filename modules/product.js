const request = require('request');
const axios = require('axios');
const apiError = require('../exeption/api-error');
const errorText = require('../src/answer').error;
const productService = require('../service/Product');
const userDB = require('../dto/user');
const productDB = require('../dto/product');
require('chromedriver');
let webdriver = require('selenium-webdriver');
let chrome = require("selenium-webdriver/chrome");
const tokenService = require('../service/Token');
const {Builder, Browser, By, Key, until} = require('selenium-webdriver');

let answer = [];
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function authValidate(token, task1){
    let isLog = tokenService.validateAccessToken(token)
    console.log(token);
    if(isLog){
        if(isLog.payload != task1){
            throw apiError.BadRequest(errorText.tokenError);
        }
    }  else {
        throw apiError.BadRequest(errorText.tokenError);
    }
}
class product{
    async seller(graph = false, dateFrom, flag = false, type = 0, access, task1 = 1111, article = false, date = false){
        if(!dateFrom){
            throw apiError.BadRequest(errorText.reqData);
        }
        task1 = 1111;
        // authValidate(access, task1);
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
            console.log(response);
            for( let i of response.data){
                let date = String(i['date']).split('T')[0];
                products.push({});
                let pr = await productDB.getByArticleOrder(i['nmId']);
                products[products.length - 1]['discount'] = i['discountPercent'];
                products[products.length - 1]['naming'] = i['subject'];
                products[products.length - 1]['brand'] = i['brand'];
                products[products.length - 1]['price'] = i['forPay'];
                products[products.length - 1]['article'] = i['nmId'];
                products[products.length - 1]['srid'] = i['srid'];
                products[products.length - 1]['date'] = date;
                products[products.length - 1]['img'] = `https://images.wbstatic.net/c246x328/new/${String(products[products.length - 1]['article']).slice(0, 5)}0000/${String(products[products.length - 1]['article'])}-1.jpg`;
                products[products.length - 1]['barcode'] = i['barcode'];
                products[products.length - 1]['category'] = i['category'];
                products[products.length - 1]['size'] = i['techSize'];
                products[products.length - 1]['region'] = i['oblast'];
                products[products.length - 1]['pwz'] = i['warehouseName'];
            }
            await productDB.addSeller(task1, products);
            await userDB.setUserSaves(task1, 1);
            answer.count = countProduct;
            answer.total = totalPrice;




        }
        let product = [];

        let productList = product['products'];
        if(article){
            productList = await productDB.getByArticleDateSeller(task1, article, date);
            productList = productList.filter(i => {
                console.log(new Date(date).getTime() ==  i['date_seller'].getTime());
                return new Date(date).getTime() ==  i['date_seller'].getTime();
            });
            console.log(productList);
        }
        if(!graph && !article){
            console.log('xxxx');
            product = await productDB.getSeller(1111, 4);
            productList = product['products'];
        } else {
            if(graph){
                product = await productDB.getSellerGraph(1111, article);
                productList = product['products'];
            }

        }
        answer = {products: productList, total: product['total'], count: product['cnt']};
        return  answer;
    }

    async order(graph = false, dateFrom, flag = false, type = 0, access, task1=1111, article = false, date = false){
        task1 = 1111;
        console.log(graph);
        if(!dateFrom){
            throw apiError.BadRequest(errorText.reqData);
        }
        //authValidate(access, task1);
        let token = await userDB.getUserByTask1(task1);
        let lasUpdates = await userDB.getUserSaves (2, task1);
        token = token[0]['token'];
        if(lasUpdates.length < 1){
            let products = [];

            let response;
            response = await axios.get(`https://suppliers-stats.wildberries.ru/api/v1/supplier/orders?dateFrom=${dateFrom}&flag=0&key=${token}`)
            response.data.map(async i => {

                products.push({});
                products[products.length - 1]['img'] = `https://images.wbstatic.net/c246x328/new/${String(i['nmId']).slice(0, 5)}0000/${String(i['nmId'])}-1.jpg`
                products[products.length - 1]['price'] = Math.round(+i['totalPrice']);
                products[products.length - 1]['brand'] = i['brand'];
                products[products.length - 1]['srid'] = i['srid'];
                products[products.length - 1]['naming'] = i['subject'];
                products[products.length - 1]['discountPercent'] = i['discountPercent'];
                products[products.length - 1]['article'] = i['nmId'];
                products[products.length - 1]['date'] = String(i['date']).replace('T', ' ');
                products[products.length - 1]['barcode'] = i['barcode'];
                products[products.length - 1]['category'] = i['category'];
                products[products.length - 1]['size'] = i['techSize'];
                products[products.length - 1]['region'] = i['oblast'];
                products[products.length - 1]['pwz'] = i['warehouseName'];

            });
            await productDB.addOrder(task1, products);
            await userDB.setUserSaves(task1, 2);
        }
        let product = [];
        let productList = [];



        if(article){
            productList = await productDB.getByArticleDateOrder(task1, article, date);

            productList = productList.filter(i => {

                return new Date(date).getTime() ==  i['date_seller'].getTime();
            });
            console.log(productList);
        }
        if(!graph && !article){
            product = await productDB.getOrder(1111, type);
            productList = product['products'];
        } else {
            if(graph){
                product = await productDB.getOrderGraph(1111, article);
                productList = product['products'];
                console.log(productList);
            }

        }
        answer = {products: productList, count: product['cnt'], total: product['total'],};
        return  answer;
    }

    async reportSeller(type, article = false, access, task1){
        console.log(access);
        if(!type){
            throw apiError.BadRequest(errorText.reqData);
        }
        authValidate(access, task1);
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
            for(let i of response.data) {
                products.push({});
                let nm_id = String(i['nm_id']);

                products[products.length - 1]['date'] = String(i['date_to']).replace('T', ' ').split(' ')[0];
                products[products.length - 1]['brand'] = i['brand_name'];
                products[products.length - 1]['article'] = nm_id;
                products[products.length - 1]['barcode'] = i['barcode'];
                let countProduct = await productDB.getByArticleSeller(nm_id);
                products[products.length - 1]['countBuy'] = +countProduct['cnt'];
                products[products.length - 1]['countRetail'] = +i['return_amount'];
                products[products.length - 1]['priceRetail'] = +i['return_amount'] * (+i['retail_amount']);
                products[products.length - 1]['logic'] = i['delivery_rub'];
                products[products.length - 1]['priceBuy'] = +i['retail_price'];
                let Product = await productDB.getByArticleOrder(nm_id);
                products[products.length - 1]['price'] = Product['price'] - ((+Product['price'] * i['product_discount_for_report']) / 100);

                products[products.length - 1]['img'] = `https://images.wbstatic.net/c246x328/new/${nm_id.slice(0, 5)}0000/${nm_id}-1.jpg`
                products[products.length - 1]['discount'] = i['product_discount_for_report'];
                products[products.length - 1]['penalty'] = i['penalty'];
                products[products.length - 1]['owner'] = i['sa_name'];
                products[products.length - 1]['size'] = i['ts_name'];
                products[products.length - 1]['srid'] = i['srid'];
                //sa_name

            }
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
        let isLog = tokenService.validateAccessToken(access)
        console.log(isLog.payload);
        if(isLog.payload != task1){
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
        let isLog = tokenService.validateAccessToken(access)
        console.log(isLog.payload);
        if(isLog.payload != task1){
            throw apiError.BadRequest(errorText.reqData);
        }
        //await productDB.
    }

    async getCompetition(article1, article2,  access){

        //authValidate(access, 1111);

        let options = new chrome.Options();
        options.addArguments(['--no-sandbox', '--headless']);
        let driver = new webdriver.Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        await driver.get('https://app.shopstat.ru/auth/login-by-email');
        let input = [];
        while (1 < 2){
            let input = await driver.findElements(By.className('MuiInputBase-input'));
            await driver.executeScript("window.scrollBy(0,250)", "");
            if(input.length > 0){
                break;
            }
        }
        await sleep(5000);
        await input[0].sendKeys('asunov.artur.2007@gmail.com');
        await input[1].sendKeys('Karate120');
        await sleep(600);
        await driver.executeScript("window.scrollBy(0,250)", "");
        await sleep(600);
        await driver.findElement(By.className('MuiButton-root')).click();
        await sleep(1000);
        await driver.executeScript("window.scrollBy(0,250)", "");
        await driver.get(`https://app.shopstat.ru/compare-products?q1=${article1}&q2=${article2}`);
        await sleep(1000);
        await driver.executeScript("window.scrollBy(0,250)", "");
        let product = await  driver.findElements(By.className('MuiTableCell-body'));

        let products = [];
        for(let i of product){
            let text = await i.getText();
            products.push(text);
        }
        let wordsList = {}
        console.log(products);
        let names =  products.filter(i => {

            return  !+i.replace(' ', '');
        });
        let numbers = products.filter(i => {

            return  +i.replace(' ', '') || i == '—';
        });
        console.log(names, numbers);
        for(let i in names){
            console.log(i);
            let key = names[i];
            let value = numbers[i];
            if(!wordsList[key]){
                wordsList[key] = [];
            }
            wordsList[key].push(value)
        }

        return wordsList;
    }

    async getAnalyze(article, access){
        if(!access | !article){

        }
        //authValidate(access, 1111);
        let options = new chrome.Options();
        options.addArguments(['--no-sandbox', '--headless']);
        let driver = new webdriver.Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        await driver.get('https://app.shopstat.ru/auth/login-by-email');
        await sleep(600);

        let input = await driver.findElements(By.className('MuiInputBase-input'));
        await input[0].sendKeys('asunov.artur.2007@gmail.com');
        await input[1].sendKeys('Karate120');
        await driver.findElement(By.className('MuiButton-root')).click();
        await sleep(600);
        await driver.get(`https://app.shopstat.ru/search-queries-by-product?q=${article}`);
        await sleep(3000);
        let body = await driver.findElements(By.className('MuiTableCell-body'));
        let products = [];
        let keys = [],
            data = []
        for(let i of body){
            let text = await i.getText();
            if(!+text.replace(' ', '').replace(' ', '').replace('\n', '') && text != '' && text !='—' ){
                keys.push(text)
            } else if(text !=''){
                data.push(text)
            }
            products.push(text);
        }
        let head = await driver.findElements(By.className('MuiTableCell-head'));
        let heads = [];
        for(let i of head){
            let text = await i.getText();
            if((text !='Поисковый запрос' && text !='Товаров' && text != '') || text.length < 2)
                heads.push(text);
        }
        let answer = { products: {}, dates: heads, seller: [], order: []};
        let already = [];
        let index = 0;
        for(let key in keys){
            if(!answer.products[keys[key]]){
                answer.products[keys[key]] = [];
            }
            answer.products[keys[key]].push(data[index]);
            index+=1;
        }
        index = keys.length;
        let keysIndex = 0;
        for(let i =  index; i < data.length; i++) {
            if (data[index].split('\n').length > 1) {
                let num = data[index].split('\n');
                let num2 = data[1 + index].split('\n');
                if (num[0] > num2[0]) {
                    data[index] = `${num[0]}⬇${num[1]}`;
                } else {
                    data[index] = `${num[0]}⬆${num[1]}`;

                }
            }
            if(answer.products[keys[keysIndex]].length >=heads.length){
                if(keys[keysIndex+1]) {

                    keysIndex+=1;
                } else {
                    break;
                }
            }
            console.log(keys[keysIndex]);
            answer.products[keys[keysIndex]].push(data[index]);
            index+=1;
        }
        console.log(data)

        driver.quit();
        let productAnswer = await productDB.getAnalyzeProduct(article);
        let seller = await productDB.getAnalyzeGraphSeller(article);
        let order = await productDB.getAnalyzeGraphOrder(article);
        answer.data = productAnswer;
        answer.seller = seller;
        answer.order = order;
        return answer;
    }

    async getAllEconomy(access){
        if(!access){
            throw apiError.BadRequest(errorText.reqData);
        }
        authValidate(access, 1111); // pockachto
        let product = await productDB.getEconomyAll();

        answer = {products: product};
        return  answer;
    }

    async getProduct(article){
        let product = {};
        product = await productService.findProductByArt(article);
        return product;
    }

    async abcAnalyze(task1, access){
        if(!task1 || !access){
            //throw apiError.BadRequest(errorText.reqData);
        }
        //authValidate(access, 1111);
        let analyzeData = {
            a: {totalSum: 0, prs: 0, cnt: 0},
            b: {totalSum: 0, prs: 0, cnt: 0},
            c: {totalSum: 0, prs: 0, cnt: 0},
        }
        let product = await productDB.abcGet(1111),
            totalSum = await productDB.getTotalPriceAnalyze(1111);

        product.sort((a, b) => {
            return (+b.cnt * +b.price) - (+a.cnt * +a.price);
        });
        let prsCount = 0;
        product.map(i => {
            let prs = ((+i.cnt * +i.price) * 100) / totalSum;

            prsCount += prs;
            if(prsCount < 70){
                analyzeData.a.prs  = prsCount;
                analyzeData.a.totalSum += +i.cnt * +i.price;
                analyzeData.a.cnt += +i.cnt;
                console.log(1);
                analyzeData[i['article']] = 'A';
            } else if(prsCount < 90){
                analyzeData.b.prs = prsCount;
                analyzeData.b.totalSum += +i.cnt * +i.price;
                analyzeData.b.cnt += +i.cnt;
                analyzeData[i['article']] = 'B';
            } else {
                analyzeData.c.prs = prsCount;
                analyzeData.c.totalSum += +i.cnt * +i.price;
                analyzeData.c.cnt += +i.cnt;
                analyzeData[i['article']] = 'C';
            }
        })
        return analyzeData;

    }
}

module.exports = new product();