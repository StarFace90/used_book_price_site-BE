const request = require('request');
const config = require('./config');


let query = "해리 포터";
let ttbkey = config.api_Key;

// 상품 검색 api
const options = {
    uri: `http://www.aladin.co.kr/ttb/api/ItemSearch.aspx?`,
    qs: {
        ttbkey: ttbkey,
        query: query,
        queryType: 'Title',
        maxResults: '1',
        start: '1',
        output: 'js',
        optResult: 'usedList', // 중고책 정보 필요
        version: '20131101'
    }
};

//? usedList,c2binfo를 array 형태로 요청하라는데 잘못한건지 원하는 데이터가 나오지 않았다.
//? 오히려 c2binfo 만 요청했을시에 원하는 중고 매입가가 나온다.
// 상품조회 api 
const options2 = {
    uri: `http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?`,
    qs: {
        ttbkey: ttbkey,
        itemId: '9788983928450',
        itemIdType: 'ISBN13',
        //itemIdType: 'itemId',
        output: 'js',
        version: '20131101',
        optResult: 'c2binfo'
    }
}


/**
 * 
 * yes24 정보
link : 상품 페이지로 가는 링크
img : 상품 이미지
title : 상품 이름
author : 저자 
publishDate : 출판 날짜 
isbn13 : isbn 넘버 
isbn10 : isbn 넘버 
priceList : 정가
priceHighest : 매입가(최상)
pricehHigh : 매입가(상)
priceMiddle : 매입가(중)  
 */

// {
//     id: 17,
//     link: 'http://www.yes24.com/Product/Goods/3718319',
//     img: 'http://image.yes24.com/goods/3718319/M',
//     title: "[도서] 원서 읽는 단어장 Harry Potter and the Sorcerer's Stone 해리포터와 마법사의돌",
//     author: [ '롱테일북스 편집부 편 ', ' 롱테일북스 ', ' 2010년 03월' ],
//     isbn: [ 'ISBN13 - 9788956054421 ', ' ISBN10 - 8956054428' ],
//     priceText: [ '정가', '매입가(최상)', '매입가(상)', '매입가(중)\n' ],
//     price: [ '6,000원', '1,200원', '1,100원', '1,000원' ]
//   },


/**
 * 알라딘 api 응답 정보
 * 
 *   title : 상품명
 *   link : 상품링크
 *   author : 저자
 *   pubdate : 출간일
 *   pricestandard : 정가
 *   cover : 표지
 *   isbn : isbn 10
 *   isbn13 : isbn 13
 */



request(options, function (err, res, body) {
    try {
        //console.log('res', res)
        let data = JSON.parse(body);
        console.log(data)
        let aladin = data.item;
        for (let i = 0; i < aladin.length; i++) {
            var aladinData = aladin[i];
            var getData = {
                title: aladinData.title,
                link: aladinData.link,
                author: aladinData.author,
                pubDate: aladinData.pubDate,
                subInfo: aladinData.subInfo,
            }

        }
        //console.log("body", data)
        console.log("test111", getData.subInfo);
        console.log(getData)

        console.log('statusCode:', res && res.statusCode); // res가 확인되면 상태코드를 출력한다
        //console.log('통과')
    } catch (error) {
        console.error("에러발생:", err)
    }

});

request(options2, function (err, res, body) {
    try {
        let data = JSON.parse(body);
        console.log("여기", data)
        let aladin = data.item;
        for (let i = 0; i < aladin.length; i++) {
            var aladinData = aladin[i];
            var getData = {
                title: aladinData.title,
                link: aladinData.link,
                author: aladinData.author,
                pubDate: aladinData.pubDate,
                subInfo: aladinData.subInfo,
            }

        }
        //console.log("body", data)
        console.log("test222", getData.subInfo);
        console.log(getData)

        console.log('statusCode:', res && res.statusCode); // res가 확인되면 상태코드를 출력한다
        //console.log('통과')
    } catch (error) {
        console.error("에러발생:", err)
    }

});





//console.log(getData)
