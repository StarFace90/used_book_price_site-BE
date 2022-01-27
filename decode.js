// 검색어 해리포터를 기준으로 
// 영어 harry potter일 경우 
// SearchWord=harry%20potter&


// isbn13 일 경우
// SearchWord=9788983928207&

// isbn10 일 경우
// SearchWord=8983928204&

// 한글 해리 포터 일 경우 
// SearchWord=%uD574%uB9AC%20%uD3EC%uD130&

// 한글 해리포터 일 경우
//SearchWord=%uD574%uB9AC%uD3EC%uD130&

// 띄어쓰기는 %20 임을 알 수 있다.


var str = `'\uD83D\uDC04'`;  // 강아지 이모티콘
console.log(str);


var key = '해리포터'

// 목적은 %uD574%uD53C&

// let cc = toBase64(key);
// console.log(cc);

let cc = key;
console.log(cc);


/**
 * mdn charCodeAt(index)을 통해 확인 한 결과
 * 113의 아스키 문자는 q
 * '해'의 아스키 코드는 54644
 */


// 해 -> %uD574

let a = '해'.charCodeAt(0);
console.log("a", a); // 54644

let b = '해'.charCodeAt(0).toString(16);
console.log("b", b); //  d574


let splstr = key.split('');
console.log(splstr)


for (let key in splstr) {
    console.log('%u' + splstr[key].charCodeAt(0).toString(16));
}




let vv = '해리포터'.charCodeAt(0).toString(16);

console.log(vv);

// let texted = '%uD574%uB9AC%20%uD3EC%uD130';


// let text = decodeURI(texted);

// console.log(text);


let charToUnicode = function (str) {
    if (!str) return false; // 문자(검색어 입력) 없을 시 false -> 종료
    let unicode = '';
    for (let i = 0; i < str.length; i++) {
        let transUpper = str[i].charCodeAt(0).toString(16);
        console.log("변환전", transUpper);
        // 문자에 띄어쓰기가 있을 경우 %20으로 변환되기 때문에 삼항조건연산자를 사용하여 조건을 주었다.
        transUpper !== '20'
            ? unicode += '%u' + transUpper.toUpperCase()  // '%u'를 변환된 유니코드 문자 앞에 삽입하고 뒤의 문자를 대문자로 변환하여 실제 yes24 한글 검색시 변환 되는 주소와 같게 한다. 
            : unicode += '%' + transUpper.toUpperCase();
    };
    return unicode;
}

let result = charToUnicode('해리 포터')

console.log(result) 