const express = require('express');
const fs = require('fs');
//const scrap = require('./test_yes24');
//const request = require('request');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
app.use(cors())
app.use(morgan('dev'))


// 테스트용 코드 수정은 나중에..

//console.log("dsd", scrap);

//? 알라딘 api와 Yes24 데이터를 어떻게 가공할까...?? 
//? 통합 api를 만들어서 프런트로 보내기 
//? json 파일을 생성하여 그 파일을 json형태로 프런트로 보내기
//? 




// async function logName() {
//     let data = await scrap
//     console.log("데이터", data);
// }

//? 현상태에서 서버를 실행하면 무한 파일 생성이 되어버린다. (요청하면서 계속 크롤링 함수가 실행되는 것이 문제로 추측)
//! 현재는 모듈로 불러오는 것 때문에 계속해서 크롤링이 되는 것으로 파악!
//! 함수가 비워지면 빈내용의 파일만 계속 생성

app.get('/yes24', (req, res) => {
    //logName();
    //fs.readFile(`./Docs/yes24Data-${fileName}.json`, (err, data) => {

    // 프런트 보내는지 확인을 위해 임의의 파일
    fs.readFile(`./Docs/yes24Data-2022-02-03-235136.json`, (err, data) => {
        if (err) throw err;
        data = JSON.parse(data);
        res.send(data);
    })

})


app.get('/', (req, res) => {
    res.send('Hello, World');
});


app.set('port', process.env.PORT || 5000);


app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});