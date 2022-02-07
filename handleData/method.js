
// 자주 쓰이거나 중복되는 함수 모듈화




const fileNameLive = function () {
    // 파일 이름이 같으면 덮어씌워지므로 년/월/일/시간/분/초 로 한다 
    let today = new Date();
    let year = today.getFullYear();
    let month = ('0' + (today.getMonth() + 1)).slice(-2);
    let day = ('0' + today.getDate()).slice(-2);
    let hours = ('0' + today.getHours()).slice(-2);
    let minutes = ('0' + today.getMinutes()).slice(-2);
    let seconds = ('0' + today.getSeconds()).slice(-2);
    let fileName = year + '-' + month + '-' + day + '-' + hours + minutes + seconds;

    return fileName;
}






// yes24랑 알라딘 api 맞추기


const yes24 = [
    {
        "id": 0,
        "link": "http://test.com//",
        "img": "https://image.test.com/",
        "title": "[도서] 테스트",
        "author": [
            "테스트 작가",
            " 테스트 출판사 ",
            " 2021년 11월"
        ],
        "isbn": [
            "ISBN13 - 1234567890xxx ",
            " ISBN10 - 0987654321"
        ],
        "priceText": [
            "정가",
            "매입가(최상)",
            "매입가(상)",
            "매입가(중)\n"
        ],
        "price": [
            "17,800원",
            "7,200원",
            "6,500원",
            "5,700원"
        ]
    }
]

const aladin = [
    {
        "id": 0,
        "link": "http://www.test.co.kr/shop",
        "cover": "https://image.test.co.kr/product",
        "title": "자바스크립트1",
        "pubDate": "2021-01-22",
        "author": "지은이",
        "isbn": "K1327xcsd5",
        "isbn13": "abcderfs32212",
        "subInfo": {
            "AA": 7500,
            "A": 6800,
            "B": 6000,
            "C": 0
        }
    },
    {
        "id": 1,
        "link": "http://www.test.co.kr/shop",
        "cover": "https://image.test.co.kr/product",
        "title": "자바스크립트2",
        "pubDate": "2021-01-22",
        "author": "지은이",
        "isbn": "K1327xcsd5",
        "isbn13": "abcderfs32212",
        "subInfo": {
            "AA": 8500,
            "A": 4800,
            "B": 3000,
            "C": 0
        }
    }
]



// 숫자에 한국 화폐 기준으로 콤마찍기
const makeComma = function (arr) {

    let priceComma = [];


    for (var m of arr) {

        let money = m.toLocaleString('ko-KR');
        priceComma.push(money.toString() + "원");
    }

    return priceComma;
}






const fitUsedBookData = function (obj1, obj2) {

    //let priceTextInfo = Object.keys(obj1[0].subInfo); // 정가, 매입가..
    //let priceInfo = Object.values(obj1[0].subInfo); // 10000원, 5000원...

    //let priceText = [];
    // let price = [];


    // for (let key in obj1) {
    //     console.log("key", obj1[key]['subInfo']);
    // }




    // obj1에서 subInfo의 키와 값 분리 작업
    for (let info of obj1) {
        var subInfo = info['subInfo'];
    }
    console.log("subInfo: ", subInfo); // { AA: 8500, A: 4800, B: 3000, C: 0 }



    // let priceTextInfo = Object.keys(subInfo);
    // let priceInfo = Object.values(subInfo)


    //console.log("priceTextInfo: ", priceTextInfo);       // [ 'AA', 'A', 'B', 'C' ]
    //console.log("priceInfo: ", priceInfo);      // [ 8500, 4800, 3000, 0 ]


    // obj1.priceText = priceTextInfo;
    //obj1.price = priceInfo;
    //delete obj1[0].subInfo;


    let arr = [];

    for (let i = 0; i < obj1.length; i++) {
        // console.log("포문", obj1[i]['subInfo']) // { AA: 7500, A: 6800, B: 6000, C: 0 }

        var priceTextInfo = Object.keys(subInfo);
        var priceInfo = Object.values(subInfo);
        let priceText = priceTextInfo;//[ 'AA', 'A', 'B', 'C' ]
        priceText.splice(0, 4, "정가", "매입가(최상)", "매입가(상)", "매입가(중)");
        //var price = priceInfo; // [ 8500, 4800, 3000, 0 ]

        var price = makeComma(priceInfo);

        console.log("여기", price)




        obj1[i].priceText = priceText;
        obj1[i].price = price; // [ 8500, 4800, 3000, 0 ]

        delete obj1[i].subInfo; // 기존에 남은 subInfo를 지운다
    }

    console.log("결과:", obj1)


    // for (let key in c) {
    //     priceText.push(key);
    //     price.push(c[key]);
    // }
    //console.log("323", priceText);
    //console.log("123", price);

}


fitUsedBookData(aladin, yes24);






module.exports = {
    fileNameLive
}