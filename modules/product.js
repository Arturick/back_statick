const request = require('request');
const axios = require('axios');
const apiError = require('../exeption/api-error');
const errorText = require('../src/answer').error;
const productService = require('../service/Product');
const userDB = require('../dto/user');
const productDB = require('../dto/product');
//require('chromedriver');
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
    async seller(user, dateFrom,  graph = false,  flag = false, type = 0, article = false, date = false){
        console.log(user);
        if(!dateFrom){
            throw apiError.BadRequest(errorText.reqData);
        }
        // authValidate(access, task1);


        let lasUpdates = await userDB.getUserSaves(1, user['id']);
        let token = user['token'];

        if(lasUpdates.length < 1){
            let lcDate =  new Date(new Date().getTime() - (29 *86400000));
            let response,
                totalPrice = 0,
                countProduct = 0,
                products = [];
            if(token.length < 70){
                response = await axios.get(`https://suppliers-stats.wildberries.ru/api/v1/supplier/sales?dateFrom=${lcDate}&key=${token}`)

            }
            else {
                let config = {
                    headers: {
                        Authorization: token
                    }
                }
                response = await axios.get(`https://statistics-api.wildberries.ru/api/v1/supplier/sales?dateFrom=${lcDate}`, config);

            }

            await productDB.addSeller(user['task1'], response.data);
            await userDB.setUserSaves(user['id'], 1);
            answer.count = countProduct;
            answer.total = totalPrice;




        }
        let product = [];

        let productList = product['products'];
        if(article){
            productList = await productDB.getByArticleDateSeller(user['task1'], article, date);
            productList = productList.filter(i => {
                console.log(new Date(date).getTime() ==  i['date_seller'].getTime());
                return new Date(date).getTime() ==  i['date_seller'].getTime();
            });
            console.log(productList);
        }
        if(!graph && !article){
            product = await productDB.getSeller(user['task1'], type);
            productList = product['products'];
        } else {
            if(graph){
                product = await productDB.getSellerGraph(user['task1'], article);
                productList = product['products'];
            }

        }
        answer = {products: productList, total: product['total'], count: product['cnt']};
        return  answer;
    }

    async order(user, dateFrom, graph = false,  flag = false, type = 0, article = false, date = false){

        if(!dateFrom){
            throw apiError.BadRequest(errorText.reqData);
        }
        let lcDate =  new Date(new Date().getTime() - (29 *86400000));
        let token = user['token'];
        let lasUpdates = await userDB.getUserSaves(2, user['id']);
        console.log(123);
        if(lasUpdates.length < 1){
            let products = [];

            let response;
            if(token.length < 70){
                response = await axios.get(`https://suppliers-stats.wildberries.ru/api/v1/supplier/orders?dateFrom=${lcDate}&flag=0&key=${token}`)
            } else {
                let config = {
                    headers: {
                        Authorization: token
                    }
                }
                response = await axios.get(`https://statistics-api.wildberries.ru/api/v1/supplier/orders?dateFrom=${lcDate}`, config);
            }

            await productDB.addOrder(user['task1'], response.data);
            await userDB.setUserSaves(user['id'], 2);
        }
        let product = [];
        let productList = [];



        if(article){
            productList = await productDB.getByArticleDateOrder(user['task1'], article, date);
            productList = productList.filter(i => {
                console.log(new Date(date).getTime() ==  i['date_seller'].getTime());
                return new Date(date).getTime() ==  i['date_seller'].getTime();
            });
        }
        if(!graph && !article){
            product = await productDB.getOrder(user['task1'], type);
            productList = product['products'];
        } else {
            if(graph){
                product = await productDB.getOrderGraph(user['task1'], article);
                productList = product['products'];
                console.log(productList);
            }

        }
        answer = {products: productList, count: product['cnt'], total: product['total'],};
        return  answer;
    }

    async reportSeller(user, type, article = false,){

        if(!type){
            throw apiError.BadRequest(errorText.reqData);
        }


        let lasUpdates = await userDB.getUserSaves( 3, user['id']);
        let token = user['token'];
        if(lasUpdates.length < 1){
            let products = [];

            let localDate = new Date(new Date().getTime() - (29 *86400000));
            let today = new Date();
            localDate = `${localDate.getFullYear()}-${localDate.getMonth() + 1}-${localDate.getDate()}`;
            today= `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
            let response;
            if(token.length < 80){
                response = await axios.get(`https://suppliers-stats.wildberries.ru/api/v1/supplier/reportDetailByPeriod?dateFrom=${localDate}&key=${token}&dateto=${today}`)

            } else {
                let config = {
                    headers: {
                        Authorization: token
                    }
                }
                response = await axios.get(`https://statistics-api.wildberries.ru/api/v1/supplier/reportDetailByPeriod?dateFrom=${localDate}&dateto=${today}`, config);

            }
            await productDB.addAnalyze(user['task1'], response.data);
            await userDB.setUserSaves(user['id'], 3);
        }
        let product = await productDB.getAnalyze(user['task1'], type, article);
        answer = {products: product['products'], count: product['cnt'], total: product['total']};




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
        //'--no-sandbox', '--headless', '—disable-gpu',
        let options = new chrome.Options();
        options.addArguments([ '--no-sandbox', '--headless', '—disable-gpu', '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36']);

        let driver = new webdriver.Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
        await driver.manage().window().setRect({
            x: 0,
            y: 0,
            width: 1000,
            height: 680
        });
        await driver.get('https://app.shopstat.ru/auth/login-by-email');
        await sleep(600);

        let input = await driver.findElements(By.className('MuiInputBase-input'));
        await input[0].sendKeys('asunov.artur.2007@gmail.com');
        await input[1].sendKeys('Karate120');
        await driver.findElement(By.className('MuiButton-root')).click();
        await sleep(1000);
        await driver.get(`https://app.shopstat.ru/compare-products?q1=${article1}&q2=${article2}`);
        await sleep(1000);
        let product = await  driver.findElements(By.className('MuiTableCell-body'));

        let products = [];
        for(let i of product){
            let text = await i.getText();
            products.push(text);
        }
        let wordsList = {}
        console.log(products);
        let names =  products.filter(i => {

            return  !+i.replace(' ', '') && i!= '—' && i!='';
        });
        let numbers = products.filter(i => {

            return  +i.replace(' ', '').replace(' ', '').replace(' ', '') || i == '—';
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

    async getAnalyze(article){

        //authValidate(access, 1111);
        let options = new chrome.Options();
        options.addArguments(['--no-sandbox', '--headless', '—disable-gpu', '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36']);

        let driver = new webdriver.Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
        await driver.manage().window().setRect({
            x: 0,
            y: 0,
            width: 1000,
            height: 680
        });
        await driver.get('https://app.shopstat.ru/auth/login-by-email');
        await sleep(600);
        let str = await driver.getPageSource();
            console.log(str);
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
            if(answer.products[keys[key]].length > 0){
                continue;
            }
            answer.products[keys[key]].push(data[index]);
            index+=1;
        }
        index = keys.length;
        let keysIndex = 0;
        console.log(answer.products);
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

            if(answer.products[keys[keysIndex]].length >= heads.length){
                if(keys.length  > keysIndex+1) {
                    keysIndex+=1;
                } else {
                    break;
                }
            }
            console.log(keysIndex);
            if(answer.products[keys[keysIndex]].length >= heads.length){
                if(keys.length  > keysIndex+1) {
                    keysIndex+=1;
                } else {
                    break;
                }
            }
            answer.products[keys[keysIndex]].push(data[index]);
            index+=1;
        }


        driver.quit();
        let productAnswer = await productDB.getAnalyzeProduct(article);
        let seller = await productDB.getAnalyzeGraphSeller(article);
        let order = await productDB.getAnalyzeGraphOrder(article);
        answer.data = productAnswer;
        answer.seller = seller;
        answer.order = order;
        return answer;
    }

    async getAllEconomy(task1){

        let product = await productDB.getEconomyAll(task1);

        answer = {products: product};
        return  answer;
    }

    async getProduct(article){
        let product = {};
        product = await productService.findProductByArt(article);
        return product;
    }

    async abcAnalyze(user){

        //authValidate(access, 1111);
        let analyzeData = {
            a: {totalSum: 0, prs: 0, cnt: 0},
            b: {totalSum: 0, prs: 0, cnt: 0},
            c: {totalSum: 0, prs: 0, cnt: 0},
        }
        let product = await productDB.abcGet(user['task1']),
            totalSum = await productDB.getTotalPriceAnalyze(user['task1']);

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

    async refreshDB(){
        let tokens = await userDB.getAll();
        let lcDate =  new Date(new Date().getTime() - (29 *86400000));
        for(let i of tokens){
            await userDB.refreshUserProduct(i['task1'], 1);
            console.log(i);
            let token = i['token'];
                let response,
                    products = [];
            if(token.length < 70){
                response = await axios.get(`https://suppliers-stats.wildberries.ru/api/v1/supplier/sales?dateFrom=${lcDate}&key=${token}`)

            } else {
                let config = {
                    headers: {
                        Authorization: token
                    }
                }
                response = await axios.get(`https://statistics-api.wildberries.ru/api/v1/supplier/sales?dateFrom=${lcDate}`, config);

            }

                await productDB.addSeller(i['task1'], response.data);
                await userDB.setUserSaves(i['task1'], 1);
            products = [];
            await userDB.refreshUserProduct(i['task1'], 2);
            if(token.length < 70){
                response = await axios.get(`https://suppliers-stats.wildberries.ru/api/v1/supplier/orders?dateFrom=${lcDate}&flag=0&key=${token}`)
            } else {
                let config = {
                    headers: {
                        Authorization: token
                    }
                }
                response = await axios.get(`https://statistics-api.wildberries.ru/api/v1/supplier/orders?dateFrom=${lcDate}`, config);
            }
            await productDB.addOrder(i['task1'], response.data);
            await userDB.setUserSaves(i['task1'], 2);

            await userDB.refreshUserProduct(i['task1'], 3);
            products = [];
            let localDate = new Date(new Date().getTime() - (29 *86400000));
            let today = new Date();
            localDate = `${localDate.getFullYear()}-${localDate.getMonth() + 1}-${localDate.getDate()}`;
            today= `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
            if(token.length < 80){
                response = await axios.get(`https://suppliers-stats.wildberries.ru/api/v1/supplier/reportDetailByPeriod?dateFrom=${localDate}&key=${token}&dateto=${today}`)

            } else {
                let config = {
                    headers: {
                        Authorization: token
                    }
                }
                response = await axios.get(`https://statistics-api.wildberries.ru/api/v1/supplier/reportDetailByPeriod?dateFrom=${localDate}&dateto=${today}`, config);

            }
            await productDB.addAnalyze(i['task1'], response.data);
            await userDB.setUserSaves(i['task1'], 3);

            }
    }

    async getMinus(user){

        let answer = await productDB.getMinus(user['task1']);

        return answer;
    }

    async deleteMinus(user){
        await productDB.deleteMinus(user);
    }

    async getAllSellerDiagram(task1){
        let answer = await productDB.getAllSellerDiagram(task1)
        return answer;
    }

    async getAllOrderDiagram(task1){
        let answer = {total: 0, cnt: 0, retailTotal: 0, retailCnt: 0};
        let product = await productDB.getAllOrder(task1);
        let seller = await productDB.getSellerAll(task1);
        let sridAlready = [];
        for(let i of seller){
            sridAlready.push(i['srid']);
        }
        for(let i of product){
            answer.total += i['price'];
            answer.cnt +=1;
            if(sridAlready.indexOf(i['srid'])  < 0){
                answer.retailTotal += i['price'];
                answer.retailCnt +=1;
            }
        }
        return answer;
    }

    async getAllRetail(task1){
        let answer = [];
        answer = await  productDB.getAllRetail(task1);

        return answer[0];

    }

    async addMinus(task1, value, isNumber, allTime, old, naming, percent){
        let pr = percent == 'Да' ? 1 : 0;
        await productDB.addMinus(task1, value, isNumber, allTime, old, naming, pr);
        return {};
    }

}

module.exports = new product();