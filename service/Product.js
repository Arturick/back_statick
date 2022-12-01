const axios = require('axios');


class Product {
    async findProductByPos(article, query ){
        if(!article || !query){
            return null;
        }
        let position = -1,
            isPosition = false,
            needProduct = await this.findProductByArt(article);
        console.log(needProduct);
        for(let i = 1; i<65; i++){
            await axios.get(`https://search.wb.ru/exactmatch/ru/common/v4/search?appType=1&couponsGeo=12,3,18,15,21&curr=rub&dest=-1029256,-102269,-2162196,-1257786&emp=0&lang=ru&locale=ru&page=${i}&pricemarginCoeff=1.0&query=${query}&reg=0&regions=68,64,83,4,38,80,33,70,82,86,75,30,69,22,66,31,40,1,48,71&resultset=catalog&sort=popular&spp=0&suppressSpellcheck=false`)
                .then(answer => {
                    if(!answer['data']['data']){return}
                    answer['data']['data']['products'].map(product => {

                        if(product['id'] == article || (needProduct['brand'] == product['brand'] && needProduct['naming'] == product['name'])){

                            isPosition = true;
                            position = i * 100;
                        }
                    })
                })
                .then(error => {

                })
            if(isPosition){
                break;
            }
        }

        return  {pos: position, art: article, 'query': query}
    }

    async findProductByArt(article){
        let productList = {

        }
        if(!article){
            return null;
        }
        let product = await axios.get(`https://wbx-content-v2.wbstatic.net/ru/${article}.json`)
            .then(function (res) {

                return res.data;
            })
            .catch(function (error) {
                console.log(error);
            })
        let product2 = await axios.get(`https://card.wb.ru/cards/detail?spp=0&regions=64,83,4,38,80,33,70,82,86,30,69,22,66,31,40,1,48&pricemarginCoeff=1.0&reg=0&appType=1&emp=0&locale=ru&lang=ru&curr=rub&couponsGeo=2,12,7,3,6,21&dest=-1075831,-115135,-1084793,12358353&nm=${article}`)
            .then(function (res) {

                return res.data;
            })
            .catch(function (error) {
                console.log(error);
            })

        if(!product['selling']){
            return false;
        }
        productList['image'] = `https://images.wbstatic.net/c246x328/new/${String(article).slice(0,4)}0000/${String(article)}-1.jpg`
        productList['brand'] = product['selling']['brand_name'];
        productList['article'] = String(article);
        productList['price'] = +product2['data']['products'][0]['salePriceU'] / 100;
        productList['naming'] = product2['data']['products'][0]['name'];

        productList['description'] = product['description'];
        let sizes = [];

        for(let i of product2['data']['products'][0]['sizes']){
            sizes.push(i['origName'])
        }
        productList['size'] = sizes;
        return productList;
    }
    async findProductsByPos(article){

    }
}

module.exports = new  Product();