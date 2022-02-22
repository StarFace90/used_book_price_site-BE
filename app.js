const express = require('express');
const fs = require('fs');
// const scrap = require('./yes24Data');
//const request = require('request');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
//const test = require('./test');
const { getQueryFromClient } = require('./handleData/aladinApi');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/'));


const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};


app.use(cors(corsOptions))
app.use(morgan('dev'))





// 테스트용 코드 수정은 나중에..

//console.log("dsd", scrap);

//? 알라딘 api와 Yes24 데이터를 어떻게 가공할까...?? 
//? 통합 api를 만들어서 프런트로 보내기 
//? json 파일을 생성하여 그 파일을 json형태로 프런트로 보내기
//? 




// async function logName() {
//     let data = await scrap.yes24Crawl();
//     console.log("데이터", data);
// }


// function getAladin(obj) {
//     let dataQuery = obj.query
//     return dataQuery;
// }



//? 현상태에서 서버를 실행하면 무한 파일 생성이 되어버린다. (요청하면서 계속 크롤링 함수가 실행되는 것이 문제로 추측)
//! 현재는 모듈로 불러오는 것 때문에 계속해서 크롤링이 되는 것으로 파악!
//! 함수가 비워지면 빈내용의 파일만 계속 생성




app.use('/yes24', (req, res) => {
    //logName();
    //fs.readFile(`./Docs/yes24Data-${fileName}.json`, (err, data) => {
    console.log("들어오는 요청", req.body);

    // 클라이언트에서 오는 검색어 -> 예) 자바스크립트

    let query = req.body;



    getQueryFromClient(query);


    // 프런트 보내는지 확인을 위해 임의의 파일
    fs.readFile(`Docs/aladinApi.json`, (err, data) => {
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


