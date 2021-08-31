var fs=require('fs');
//readFileSync

console.log('A');
var result=fs.readFileSync('nodejs/sample2.txt','utf8');
console.log(result);
console.log('C');


//Async
console.log('A');
fs.readFile('nodejs/sample2.txt','utf8',function(err,result){
    //함수를 세번째 인자로 주고, 작업이 끝난 후에 function을 실행시킨다.
    //파일을 읽은 다음에 나중에 함수를 호출함=> callback
    console.log(result);
});

console.log('C');