var name1='ashie';
var letter= 'Dear '+name1+'\n\n i always miss you.';

//번거롭게 문자열 사이에 +로 변수를 집어넣을 필요 없이 template literal을 사용하면 편하다.

var letter=`Dear ${name1},\n\n i always miss you.`;
//``사이에 변수는 ${}안에 집어넣으면 된다. 결과는 위와 같다.