const scrap = require('puppeteer');

var keyword = 'harry potter';

// app.js로 보내기 위한 모듈화
module.exports =
    (async () => {
        const browser = await scrap.launch(); // headless 브라우저 실행
        const page = await browser.newPage(); // 새로운 페이지 열기 -> yes24 중고 매입 페이지

        // 직접 특정 값을 줘서 데이터 잘 오는지 확인 (여기서는 검색어 베르나르 베르베르)
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
                    isbn: yes24Data[i].querySelector('p.bbG_isbn').innerText.split(' | '),

                    priceText: priceText,
                    price: price,

                });
            }
            return scrappedData;

            //scrappedData.push()

        })
        // console.log('priceText', priceText);
        //console.log('price', price);
        console.log("결과값", usedBooks);

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



        await browser.close();


    })();