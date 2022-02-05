
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


module.exports = {
    fileNameLive
}