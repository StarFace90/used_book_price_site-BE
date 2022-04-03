// 알라딘과 yes24 api 통합 코드

const express = require('express');

const yes24 = require('./yes24Data');
const aladin = require('./aladinApi');

const fs = require('fs');
// const loadAldadinFile = () => {
const app = express();






// }
const booksQueryData = async (obj) => {
    console.log('boj', obj);

    // let t1 = new Promise((resolve, rejects) => {

    // });
    await aladin.getQueryFromClientToAladin(obj);
    await yes24.getQueryFromClientToYes24(obj);
    // let t2 = new Promise((resolve, rejects) => {

    // })
    //Promise.allSettled([t1, t2]).then((results) => results.forEach((result) => console.log("asdas", result.status)))
}







module.exports = {
    booksQueryData
}