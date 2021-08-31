function a(){
    console.log('A');
}

var a=function(){
    console.log('A');
}//javascript에서는 함수가 값이다.


function slowFunc(callback){
    callback();//callback은 a함수를 값으로 갖게 된다.
}

slowFunc(a);

/*
 Callback 함수란
 => 나중에 호출되는 함수를 의미한다. 개발자는 함수를 등록하기만 하고, 어떤 이벤트가 발생하거나
 특정 시점에 도달했을 때 시스템에서 호출하는 함수를 말한다.
 -> 싱글스레드에서 blocking을 방지하여 비동기적 프로그래밍을 하기 위해서 사용한다.

 ex)setTimeout의 함수들을 통해 메인스레드가 할 일을 자바스크립트 API에게 위임해서 메인스레드의
 블록킹을 방지할 수 있다.
*/