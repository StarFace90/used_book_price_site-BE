const fs = require('fs');
const scrap = require('puppeteer');
const toUnicode = require('./decode');

//let keyword = 'harry potter';

// decode.js에서 가져온 charToUnicode 함수 사용
// ? 지금은 문자를 직접 넣었지만, 추후 프런트에서 보낼 데이터를 받아 사용
let keyword = toUnicode.charToUnicode('해리 포터');
// 띄어쓰기에도 결과 잘 나옴


// app.js로 보내기 위한 모듈화
module.exports =
    (async () => {
        const browser = await scrap.launch(); // headless 브라우저 실행
        const page = await browser.newPage(); // 새로운 페이지 열기 -> yes24 중고 매입 페이지

        // 직접 특정 값을 줘서 데이터 잘 오는지 확인 (여기서는 검색어 해리포터)
        //! 문제 실제 사이트에서 한글로 검색시 한글 키워드가 디코딩됨 해결책 모색!
        //await page.goto(`http://www.yes24.com/Mall/buyback/Search?CategoryNumber=018&SearchWord=%uBCA0%uB974%uB098%uB974%20%uBCA0%uB974%uBCA0%uB974&SearchDomain=BOOK,FOREIGN&BuybackAccept=N`)

        await page.goto(`http://www.yes24.com/Mall/buyback/Search?CategoryNumber=018&SearchWord=${keyword}&SearchDomain=BOOK,FOREIGN&BuybackAccept=N`)


        // usedBooks을 선언하여 전체 데이터 가져온다.
        const usedBooks = await page.evaluate(() => {
            let scrappedData = []; // 스크랩된 내용을 담을 빈 배열

            let yes24Data = document.querySelector('div.bbGoodsList').children[0].children;

            for (let i = 0; i < yes24Data.length; i++) {


                // link : 상품 페이지로 가는 링크
                // img : 상품 이미지
                // title : 상품 이름
                // author : 저자 
                // publishDate : 출판 날짜 
                // isbn13 : isbn 넘버 
                // isbn10 : isbn 넘버 
                // priceList : 정가
                // priceHighest : 매입가(최상)
                // pricehHigh : 매입가(상)
                // priceMiddle : 매입가(중)  

                let priceText = yes24Data[i].querySelector('div.bbG_price').children[0].children[2].innerText.split('\t');
                let price = yes24Data[i].querySelector('div.bbG_price').children[0].children[3].innerText.split('\t');



                // 위에서 선언한 빈배열 안에 가공한 데이터들을 넣는다.
                scrappedData.push({
                    //normal: tbodyChilds.children[0].textContent
                    id: i,
                    link: yes24Data[i].firstElementChild.children[0].href,
                    img: yes24Data[i].firstElementChild.childNodes[1].children[0].children[0].src,
                    title: yes24Data[i].querySelector('p.bbG_name').innerText,

                    // author 배열형태 [0]부터 순서대로 저자, 출판사, 출판년월
                    author: yes24Data[i].querySelector('p.bbG_pubGrp').innerText.split('|'),
                    isbn: yes24Data[i].querySelector('p.bbG_isbn').innerText.split('|'),

                    priceText: priceText,
                    price: price,

                });
            }
            return scrappedData;

            //scrappedData.push()

        })
        // console.log('priceText', priceText);
        //console.log('price', price);
        //console.log("결과값", usedBooks);

        //! 아래와 같이 데이터를 담아온다.
        /**
         * ? 가져온 데이터를 db에 담을 방법
         * ? 위에 언급된 문제 되는 디코딩 해결법 모색하기
         * ? 급하게 하느라 코드나 주석이 지저분하다 간결화 하는 방법 생각
         * ? 실제 홈페이지에서는 한글, 영어, 띄어쓰기, isbn 으로도 검색이 가능하다 
         */
        // {
        //     id: 18,
        //     link: 'http://www.yes24.com/Product/Goods/82941827',
        //     img: 'http://image.yes24.com/goods/82941827/M',
        //     title: '[도서] 해리포터와 불의 잔 3',
        //     author: [ 'J.K. 롤링 저/강동혁 역 ', ' 문학수첩 ', ' 2019년 11월' ],
        //     isbn: [ 'ISBN13 - 9788983927705', 'ISBN10 - 8983927704' ],
        //     priceText: [ '정가', '매입가(최상)', '매입가(상)', '매입가(중)\n' ],
        //     price: [ '9,500원', '2,900원', '2,600원', '2,300원' ]
        //   },

        // ? api 요청시 


        // 크롤링한 데이터와 api 요청 데이터 통합 전에 file system 모듈로 json 파일 생성 후 저장 테스트 
        // 성공시 json파일을 이용하여 db에 저장하는 방법도 모색 또는 프런트 요청에 의한 쿼리로 db에 저장하는 방법 모색




        // 파일 이름이 같으면 덮어씌워지므로 년/월/일/시간/분/초 로 한다 

        let today = new Date();
        let year = today.getFullYear();
        let month = ('0' + (today.getMonth() + 1)).slice(-2);
        let day = ('0' + today.getDate()).slice(-2);
        let hours = ('0' + today.getHours()).slice(-2);
        let minutes = ('0' + today.getMinutes()).slice(-2);
        let seconds = ('0' + today.getSeconds()).slice(-2);




        let fileName = year + '-' + month + '-' + day + '-' + hours + minutes + seconds;
        console.log(fileName);


        // usedBooks로 데이터 크롤링 한 것을 저장한다
        fs.writeFile(`../Docs/yes24Data-${fileName}.json`,
            JSON.stringify(usedBooks, null, 2), 'utf-8',
            err =>
                err ? console.error('파일 생성에 실패했습니다', err)
                    : console.log('파일 생성에 성공했습니다!')
        );


        // 파일 생성된 내용 보여주는 콘솔
        let writefileContents = JSON.parse(JSON.stringify(usedBooks));
        console.log(writefileContents);



        // 브라우저 닫기 
        await browser.close();


    })();
