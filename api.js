const request = require('request');
const config = require('./config');



let query = "9791162244494";
let ttbkey = config.api_Key;


const options = {
    uri: `http://www.aladin.co.kr/ttb/api/ItemSearch.aspx?`,
    qs: {
        ttbkey: ttbkey,
        query: query,
        queryType: 'Title',
        maxResults: '10',
        start: '1&S',
        output: 'js',
        version: '20131101'
    }
};

request(options, function (err, res, body) {
    try {
        //console.log('res', res)
        let data = JSON.parse(body);
        let aladin = data.item;
        for (let i = 0; i < aladin.length; i++) {
            var aladinData = aladin[i];
            var getData = {
                title: aladinData.title,
                link: aladinData.link,
                author: aladinData.author,
                pubDate: aladinData.pubDate
            }

        }
        //console.log("body", data)
        console.log(getData)

        console.log('statusCode:', res && res.statusCode); // res가 확인되면 상태코드를 출력한다
        //console.log('통과')
    } catch (error) {
        console.error("에러발생:", err)
    }

})

//console.log(getData)
