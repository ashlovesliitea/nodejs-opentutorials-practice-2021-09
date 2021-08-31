var http = require('http');
var fs = require('fs');
var url=require('url');
var querystring=require('querystring');
function templateHTML(title,list,body){
  return `
                  <!doctype html>
                  <html>
                  <head>
                    <title>WEB1 - ${title}</title>
                    <meta charset="utf-8">
                  </head>
                  <body>
                    <h1><a href="index.html">WEB</a></h1>
                    ${list}
                    <a href="/create">create</a>
                    ${body}
                  </body>
                  </html>
            `

}

function templateList(fileList){
      //filelist를 동적으로 읽어와서 생성한다. 일일히 태그를 만들지 않아도 됨.
      var list='<ul>';
      var i=0;
      while(i<fileList.length){
        list=list+`<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
        i=i+1;
      }
      list=list+'</ul>';
      return list;
}
var app = http.createServer(function(request,response){
    var _url = request.url;
   

    //querystring의 데이터를 파싱해와서 사용한다.
    var myURL = new URL('http://localhost:3000'+_url);
    var title=myURL.searchParams.get('id');
    var pathname= url.parse(_url,true).pathname;

   //쿼리스트링을 통해 사용자는 원하는 데이터를 전송하면, 해당 데이터에 맞는 파일을 읽어와서 동적으로 반응할 수 있다.

    console.log(title);
   console.log(pathname);
   var description=null;
          if(pathname == '/'){
                    fs.readdir('./data',function(error,fileList){
                        console.log(fileList);
                      
                      fs.readFile(`data/${title}`,'utf8',function(err,description){
                        if(title===null){
                          title='Welcome';
                          //최상위 경로로 가면 title 변수가 welcome으로 바뀌고, template이 자동으로 실행된다.
                          description='Hello,Node.js';
                        }
                        
                        
                        var list=templateList(fileList);
                        var template=templateHTML(title,list,`<h2>${title}</h2><p>${description}</p>`);
                        response.writeHead(200);
                        response.end(template);
                        //response.end안에 뭐가 들어가느냐에 따라 사용자에게 전송되는 코드가 다르다.
                  
                      //querystring의 값에 따라서 html 페이지 안의 내용을 제어할 수 있다.=> 동적인 웹페이지를 만들 수 있다.
                      });
                    })
                
                }
            else if(pathname==='/create'){
              
              fs.readdir('./data', function(error, fileList){
                var title = 'WEB - create';
                var list = templateList(fileList);
                var template = templateHTML(title, list, `
                  <form action="http://localhost:3000/process_create" method="post">
                    <p><input type="text" name="title" placeholder="title"></p>
                    <p>
                      <textarea name="description" placeholder="description"></textarea>
                    </p>
                    <p>
                      <input type="submit">
                    </p>
                  </form>
                `);
                response.writeHead(200);
                response.end(template);
            }  );} 
            else if(pathname==='/process_create'){
              const myURL=new URL('https://localhost:3000/process_create');
              var body='';
              request.on('data',function(data){

                console.log(myURL.searchParams.get('title'));
                //Too much POST data could kill the connection
                //data 부분은 조각조각의 양을 수신할 때마다 callback함수를 호출.
               body=body+data;
              });
              request.on('end',function(){
              
               console.log(body);
               let params=new URLSearchParams(body);
               console.log(params.get('title'));
               console.log(params.get('description'));
              });
              response.writeHead(200);
              response.end('success');


            }
            else{

                  //notfound  구현
                    response.writeHead(404);
                    response.end();
                    return;
                }
      }
);

app.listen(3000);