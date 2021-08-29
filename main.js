var http = require('http');
var fs = require('fs');

var app = http.createServer(function(request,response){
    var _url = request.url;
   

    //querystring의 데이터를 파싱해와서 사용한다.
    var myURL = new URL('http://localhost:3000'+_url);
    var title=myURL.searchParams.get('id');

    console.log(title);

    if(request.url == '/'){
    
      title='Welcome';
      //최상위 경로로 가면 title 변수가 welcome으로 바뀌고, template이 자동으로 실행된다.
    }
    if(request.url == '/favicon.ico'){
        response.writeHead(404);
        response.end();
        return;
    }
    response.writeHead(200);

    //쿼리스트링을 통해 사용자는 원하는 데이터를 전송하면, 해당 데이터에 맞는 파일을 읽어와서 동적으로 반응할 수 있다.
    fs.readFile( `data/${title}`,'utf8',function(err,description){
      
      var template=`
      <!doctype html>
      <html>
      <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="index.html">WEB</a></h1>
        <ol>
          <li><a href="1.html">HTML</a></li>
          <li><a href="2.html">CSS</a></li>
          <li><a href="3.html">JavaScript</a></li>
        </ol>
        <h2>${title}</h2>
        <p>${description}</p>
      </body>
      </html>
`

response.end(template);
//response.end안에 뭐가 들어가느냐에 따라 사용자에게 전송되는 코드가 다르다.
    })
    //querystring의 값에 따라서 html 페이지 안의 내용을 제어할 수 있다.=> 동적인 웹페이지를 만들 수 있다.

    console.log(__dirname+_url);
 
});
app.listen(3000);