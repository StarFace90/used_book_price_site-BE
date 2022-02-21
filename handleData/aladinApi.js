const express = require('express');
const request = require('request');
const config = require('../config/config');
const fs = require('fs');
const file = require('./method');
const path = require('path');




// console.log(path.isAbsolute("../Docs/aladinApi-2022-02-06-060520.json"));
// console.log(path.relative('/handleData/', '/Docs/aladinApi-2022-02-06-060520.json'))

// ? 오래간만에 코딩이므로 나중에 재 공부 및 코드리뷰 해보면서 로직 수정예정..

var str111 = { query: '애플' };
let ttbkey = config.api_Key;
//appAl.getAladin(str111);
let isbnData = ''; // 검색 api의 결과로 나온 isbn, isbn13을 담을 변수
let listApiData = []; // 조회 api 데이터 변수
let options2 = ''; // 조회 api 요청 쿼리 변수
let arr = [];  // lookUpApi 함수에서 요청된 데이터를 받을 빈 배열
let maxResults = '11'; // 최대 검색량 설정 -> 추후에 페이지네이션 생각할 것...



// 전역변수들 설정
//var query = str111 // 임의의 검색쿼리 -> 추후에는 프런트 검색어 받아서



//? 상품 검색 api의 경우 원하는 중고 서적 관련 데이터는 나오지 않지만 대부분의 데이터와 많은 검색결과를 가져온다
//? 상품 조회 api의 경우에는 원하는 중고서적 관련 데이터가 나오지만 1검색 1결과 이므로 한번의 요청으로는 부족하다
//! 그렇기 떄문에 위 두 api 요청시 상품 검색 api 결과의 isbn부분을 따로 상품 조회 api 쿼리에 넣어 다중 요청을 하는 방법으로 전환



//? 클라이언트 부분에서 res.body 부분 넘어오는 과정에서 module.exports로 app.js에서 aladinApi.js 파일로 query를 보낼 계획


function getQueryFromClient(obj) {
    let dataQuery = obj.query
    console.log(dataQuery);

    // 알라딘에서 발급 받은 api키 
    console.log(ttbkey);



    // 상품 검색 api 쿼리 options 객체변수
    const options = {
        url: `http://www.aladin.co.kr/ttb/api/ItemSearch.aspx?`,
        qs: {
            ttbkey: ttbkey,
            query: dataQuery,
            queryType: 'Title',
            maxResults: maxResults,
            start: '1',
            output: 'js',
            optResult: 'usedList', // 중고책 정보 필요
            version: '20131101'
        }
    };
    console.log(options);

    testOption(options);
}







//? 데이터 가공 결과 중복되면 검색 api 삭제 예정 : 검색 api 응답 값으로 중고 매입가격은 없으므로
//? 추가 : 상품 조회 api의 경우 isbn 및 알라딘 고유 id로 검색 해야하므로 다이렉트로 요청시 응답 값이 1개만 나온다.
//? 그러므로 상품검색 api 응답 값에서 isbn값을 따로 빼서 -> 상품 조회 api로 요청한다음 중고 매입가만 따로 빼는 방식으로 시도한다
//! 16-18번째 주석에서 문제제기 일시적? 해결완료

// 상품 검색 api의 request 요청



function testOption(options) {
    request(options,
        function (err, res, body) {
            //! local function
            //console.log('res', res)

            let data = JSON.parse(body);
            // console.log(data)
            let aladin = data.item;

            handleIsbn(aladin)
        });
}





// 다수의 isbn데이터를 상품조회 api쿼리에 요청하기 위한 함수
function handleIsbn(aladin) {
    for (let i = 0; i < aladin.length; i++) {
        let aladinData = aladin[i];

        isbnData = {
            isbn: aladinData.isbn,
            isbn13: aladinData.isbn13
        }

        // 상품조회 api 요청을 위한 option2 쿼리
        options2 = {
            url: `http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?`,
            qs: {
                ttbkey: ttbkey,
                itemId: `${isbnData.isbn13}`, // isbn13을 사용 검색api에서의 쿼리대신 조회api는 isbn을 사용한다
                itemIdType: 'ISBN13',
                //itemIdType: 'itemId',
                output: 'js',
                version: '20131101',
                optResult: 'c2binfo' // 중고책 매입여부 매입가 조회
            }
        }
        lookUpApi(options2)


    }
}


function lookUpApi(lookUpQuery) {
    request(lookUpQuery, function (err, res, body) {
        let data = JSON.parse(body)

        //? subInfo (추가적인 조회 데이터)애서 일부데이터가 c2bsales_price가 아닌
        //? 빈 데이터로 나오는 경우가 있는데 확인 결과 이는 중고 매입하지 않는 상품으로 결론!

        var lookUpData = data.item;
        // 계속해서 요청된 isbn에 의해 데이터가 새로 출력되므로 lookUpData 길이로 구하면 계속 0,1,2 반복 지저분해진다.
        // 따라서 maxResults 값을 넣어(검색량과 lookUpData의길이는 같으므로) 반복한다

        for (let i = 0; i < maxResults; i++) {


            // 데이터가 1개씩 반복되므로 조건문을 사용하여 최대검색량보다 적은 길이일 경우 새로운 배열에 추가하지 않는다.
            /**
             *     ? for문이지만 상품 조회 api의 경우는 isbn값을 조회하여 오직 1개의 결과만 보여준다.
             *     ? 여기서는 임의로 여러개의 isbn값을 요청하게 만들었으므로 계속해서 1개씩 데이터가 추가된다.
             *     ? 때문에 반복문의 경우 계속해서 같은 데이터가 반복되어지므로 낭비된다.(여러시도 후 내린 1차결론)
             *     ? 여기서는 임의로 조건을 걸어 중복없이 정확하게 요청한 데이터만 받게끔 한다
             */
            //console.log(lookUpData)

            // ! 특정 단어 에서 오류 ex) 기욤 뮈소
            if (lookUpData[i] === undefined) {
                continue;
            } else if (lookUpData[i] !== undefined) {
                arr.push(lookUpData[i])

            } if (arr.length < maxResults) {
                return;
            }
            //var를 선언하여 다음 for문에서 사용할 수 있게 한다
            var newArr = arr;
        }


        let status = '';
        let lookUphandleData = ''; // 최종적으로 가공할 조회 api 데이터 변수
        for (let j = 0; j < newArr.length; j++) {
            //  console.log(newArr[j].subInfo.c2bsales);
            //0(매입불가) or 1(매입가능)

            // 중고 매입 정보가 없을 경우 getData2 객체에 임의의 값 '중고 매입 불가' 를 추가 한다
            if (newArr[j].subInfo.c2bsales === 0) {
                status = { usedStatus: '중고매입 불가' }


                // yes24데이터와 싱크를 위해 이름 변경한다
                lookUphandleData = {
                    id: j,
                    link: newArr[j].link,
                    img: newArr[j].cover,
                    title: newArr[j].title,
                    pubDate: newArr[j].pubDate,
                    author: newArr[j].author,
                    isbn: newArr[j].isbn,
                    isbn13: newArr[j].isbn13,
                    subInfo: newArr[j].subInfo.c2bsales_price,
                    ...status
                }
            } else {
                lookUphandleData = {
                    id: j,
                    link: newArr[j].link,
                    cover: newArr[j].cover,
                    title: newArr[j].title,
                    pubDate: newArr[j].pubDate,
                    author: newArr[j].author,
                    isbn: newArr[j].isbn,
                    isbn13: newArr[j].isbn13,
                    subInfo: newArr[j].subInfo.c2bsales_price,
                    //priceText: priceText,
                    //price: price,

                }
            }

            listApiData.push(lookUphandleData);
        }
        //console.log("list", listApiData);

        let handleApi = file.handleAladinData(listApiData);
        console.log("변환", handleApi);


        // for (let key in listApiData) {
        //     // console.log("isbn13: ", listApiData[key].isbn13) // maxResults에 맞게 잘 나온다 
        // }
        // ? 무언가 이상해서 보는데 실제 알라딘 페이지의 검색결과와 api의 검색결과 순서가 다르다(기준은 모르겠다.)


        // 파일명 모듈
        const fileName = file.fileNameLive();


        //기존 경로에서 handleData폴더로 이동시 절대경로는 되고 상대경로 적용 안된 것 해결 (부모폴더 아닌 동등한 폴더로 바로 폴더명/이름 해결)
        // 참고 링크 https://okky.kr/article/756784

        //  api 데이터를 json파일로 저장한다
        fs.writeFile(`Docs/aladinApi-${fileName}.json`,
            JSON.stringify(handleApi, null, 2), 'utf-8',
            err =>
                err ? console.error('파일 생성에 실패했습니다', err)
                    : console.log('파일 생성에 성공했습니다!')
        );


        // 파일 생성된 내용 보여주는 콘솔
        let writefileContents = JSON.parse(JSON.stringify(listApiData));
        //console.log(writefileContents);

    })

}

module.exports = {
    getQueryFromClient
}