const express = require('express');
const fs = require('fs');
// const scrap = require('./yes24Data');
//const request = require('request');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
//const test = require('./test');

const dataHandler = require('./handleData/dataHandle');
const { next } = require('cheerio/lib/api/traversing');

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


// const fileLenAl = fs.readFileSync('Docs/aladinApi.json', 'utf-8');
// const fileLen24 = fs.readFileSync('Docs/yes24Data.json', 'utf-8');





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




app.use('/api', async (req, res, next) => {
    //logName();
    let query = req.body['searchData'];
    console.log(query);
    // console.log("들어오는 요청1", req.body);

    // const listFolder = 'Docs';
    // const fileNameList = fs.readdirSync(listFolder);

    // let fileIs = fileNameList.includes('booksApi.json');

    // if (fileIs === true) {

    //     fs.unlink("Docs/booksApi.json", async (err) => {
    //         if (err) {
    //             console.log(err);
    //         }
    //         //   console.log('파일 존재 삭제처리');
    //         console.log('삭제완료');
    await dataHandler.booksQueryData(query);
    next();
    //     });
    // } else {
    //     console.log('파일 없음');
    //     await dataHandler.booksQueryData(query);
    //     next();
    // }




    // 클라이언트에서 오는 검색어 -> 예) 자바스크립트


    // console.log("b", b);

    // if ((fileLenAl.length === 0) && (fileLen24.length === 0)) {
    //     // await dataHandler.booksQueryData(query);

    // }
    // if ((fileLenAl.length !== 0) && (fileLen24.length !== 0)) {
    //     next();
    //     //     }
    //     //     
    //     // }

    // }

});


// let queryName = exports.queryName = function (query) {
//     console.log("들어오는 요청2", query);
// }


app.post('/api', (req, res, next) => {

    fs.readFile('Docs/yes24Data.json', (err, data1) => {
        //  console.log("검색1");
        let yes24 = JSON.parse(data1);
        console.log("yes24길이 [{}] 형태이므로 : 20", yes24.length);
        fs.readFile('Docs/aladinApi.json', (err, data2) => {
            // console.log('검색2');
            let aladin = JSON.parse(data2);
            console.log("알라딘 길이 : 1", aladin[0].length);
            let plusFile = aladin.slice();
            plusFile.push(yes24);
            console.log("합산배열길이: 항상2여야 할 것", plusFile.length);
            fs.writeFile("Docs/dummyApi.json", JSON.stringify(plusFile), (err) => console.error(err));
            fs.writeFile("Docs/booksApi.json", JSON.stringify(plusFile), function (err) {
                if (err)
                    console.error(err);
                else {
                    //      console.log('생성');
                    fs.readFile("Docs/booksApi.json", (err, data) => {
                        if (err) throw err;
                        data = JSON.parse(data);
                        res.send(data);
                        removeContentFile();

                    })
                }
            });
        })
    });
});



const removeContentFile = () => {
    console.log("파일확인하기1234");
    // fs.open('Docs/yes24Data.json', 'w', function (err, f) {
    //     if (err) {
    //         return console.error(err);
    //     }
    // })
    // fs.open('Docs/aladinApi.json', 'w', function (err, f) {
    //     if (err) {
    //         return console.error(err);
    //     }
    // })
    // fs.open('Docs/booksApi.json', 'w', function (err, f) {
    //     if (err) {
    //         return console.error(err);
    //     }
    // })
    fs.unlink("Docs/aladinApi.json", async (err) => {
        if (err) {
            console.log(err);
        }
        //   console.log('파일 존재 삭제처리');
        console.log('삭제완료')
    })

    fs.unlink("Docs/yes24Data.json", async (err) => {
        if (err) {
            console.log(err);
        }
        //   console.log('파일 존재 삭제처리');
        console.log('삭제완료')
    })

    fs.unlink("Docs/booksApi.json", async (err) => {
        if (err) {
            console.log(err);
        }
        //   console.log('파일 존재 삭제처리');
        console.log('삭제완료')
    })

}
app.set('port', process.env.PORT || 5000);


app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});

