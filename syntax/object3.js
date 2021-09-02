var v1='v1';
var v2='v2';
//함수는 값이고, 객체는 값을 담고 있는 그릇이라고 볼 수 있다.
var o={
    v1:'v1',
    v2:'v2',
    //하나의 객체에 변수들을 정리해서 넣음.

    f1:function(){
        console.log(this.v1);
    },
    
    f2:function(){
        console.log(this.v2);
    }
    
}
//관련된 함수와 변수가 정리되어있기 때문에 더 깔끔하다.


o.f1();
o.f2();