const express = require('express');
const scrap = require('./test_yes24');
const request = require('request');


// 알라딘 api키의 발급이 늦어지고 있는 관계로 yes24 크롤링 테스트 
// 테스트용 코드 수정은 나중에..


async function logName() {
    let data = await scrap
    console.log("데이터", data)
}


const app = express();
app.set('port', process.env.PORT || 3000);

app.get('/', (req, res) => {
    res.send('Hello, World');
});



app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});