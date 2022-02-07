
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






// 알라딘 api 데이터 subInfo 수정을 위한 메서드



// 숫자에 한국 화폐 기준으로 콤마찍기
const makeComma = function (arr) {
    let priceComma = [];

    for (let m of arr) {
        let money = m.toLocaleString('ko-KR');
        priceComma.push(money.toString() + "원");
    }
    return priceComma;
}



//// 각각의 데이터 모두 중간에서 바꾸기 보다는 가지고온 객체들을 여기서 핸들링하여 하나의 데이터로 합치는게 낫다고 판단

//! 생각해보니 같은 책으로 비교하는 건데.. 굳이 이걸 통합할 필요가??
//! 우리가 구분해야하는 것은 가격 정도면 충분! 정확히는 중고가격과 중고 매입가
//! 나중에 어느쪽이던 데이터만 필요한 것만 뽑아 쓰면된다 왜? 같은 책이라 isbn번호랑 출판정보가 모두 같다 !!! 
//! 이거로 며칠 고민했는데 멍청한 짓을 한 것 같다.. 그래도 이것 저것 시도해보면서 감각을 찾고 있다.


const handleAladinData = function (obj) {

    // ? obj1 : aladin 객체가 들어올경우 
    // ? -> 고칠 것 subInfo의 텍스트와 값을 나눈다
    // ? -> 값에는 한국식으로 콤마와 '원'이 들어간다 

    // obj1에서 subInfo의 키와 값 분리 작업
    // for (let info of obj1) {
    //     var subInfo = info['subInfo'];
    // }
    // console.log("subInfo: ", subInfo); // { AA: 8500, A: 4800, B: 3000, C: 0 }



    for (let i = 0; i < obj.length; i++) {
        // console.log("포문", obj1[i]['subInfo']) // { AA: 7500, A: 6800, B: 6000, C: 0 }

        var priceTextInfo = Object.keys(obj[i]['subInfo']);
        var priceInfo = Object.values(obj[i]['subInfo']);
        let priceText = priceTextInfo;//[ 'AA', 'A', 'B', 'C' ]
        priceText.splice(0, 4, "정가", "매입가(최상)", "매입가(상)", "매입가(중)");
        //var price = priceInfo; // [ 8500, 4800, 3000, 0 ]


        var price = makeComma(priceInfo);   // 숫자에 콤마와 문자열을 더해주기 위한 메소드 실행

        // console.log("여기", price)


        obj[i].priceText = priceText;
        obj[i].price = price; // [ 8500, 4800, 3000, 0 ]

        delete obj[i].subInfo; // 기존에 남은 subInfo를 지운다
    }

    //console.log("결과:", obj);
    // 최종적으로 변환 된 obj;
    return obj;

}

//fitUsedBookData(aladin, yes24);

//handleAladinData(aladin);





module.exports = {
    fileNameLive,
    handleAladinData
}