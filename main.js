var http = require('http');
var fs = require('fs');
var url=require('url');
var querystring=require('querystring');
var path=require("path");

//module을 이용해 template를 밖으로 모듈화했다.
var template=require('./lib/template.js');
var sanitizeHTML=require('sanitize-html');

//createServer-> 함수를 통해서 웹 서버를 만들고, 웹서버의 요청(request)을 처리해 응답(response)을 보낸다.
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
            
              if(title === null){
                fs.readdir('./data', function(error, fileList){
                  //index 페이지
                  var title = 'Welcome';
                  var description = 'Hello, Node.js';
                  var list = template.list(fileList);
                  var html = template.html(title, list,
                    `<h2>${title}</h2>${description}`,
                    `<a href="/create">create</a>`
                  );
                  response.writeHead(200);
                  response.end(html);
                });
              }
              else{
                    fs.readdir('./data',function(error,fileList){
                        console.log(fileList);
                        //.. 등으로 다른 path로 이동하는게 불가능해진다.
                      var filteredId=path.parse(title).base;
                        //id querystring을 이용해 directory traversal이 일어나서 다른 문서에 접근할 수 있는 보안 문제가 발생할 수 있는 여지가 있다.
                      fs.readFile(`data/${filteredId}`,'utf8',function(err,description){
                       
                        //script를 sanitize함으로써 XSS를 막을 수 있다.
                        var sanitizedTitle=sanitizeHTML(title);
                        var sanitizedDescription=sanitizeHTML(description);
                        
                        var list=template.list(fileList);
                        var html=template.html(sanitizedTitle,list,`<h2>${sanitizedTitle}</h2><p>${sanitizedDescription}</p>`,
                        ` <a href="/create">create</a> <a href="/update?id=${sanitizedTitle}">update</a>
                        <form action="delete_process" method="post" onsubmit="Deleted!" >
                         <input type="hidden" name="id" value="${sanitizedTitle}">
                         <input type="submit" value="delete">
                        </form>`);
                        response.writeHead(200);
                        response.end(html);
                        //response.end안에 뭐가 들어가느냐에 따라 사용자에게 전송되는 코드가 다르다.
                  
                      //querystring의 값에 따라서 html 페이지 안의 내용을 제어할 수 있다.=> 동적인 웹페이지를 만들 수 있다.
                      });
                    })
                
                }
              }
            else if(pathname==='/create'){
              
              fs.readdir('./data', function(error, fileList){
                var title = 'WEB - create';
                var list = template.list(fileList);
                var html = template.html(title, list, `
                  <form action="/process_create" method="post">
                  
                    <p><input type="text" name="title" placeholder="title"></p>
                    <p>
                      <textarea name="description" placeholder="description"></textarea>
                    </p>
                    <p>
                      <input type="submit">
                    </p>
                  </form>
                `,'');
                response.writeHead(200);
                response.end(html);
            }  );} 
            else if(pathname==='/process_create'){
              
              var body='';
              request.on('data',function(data){

                console.log(myURL.searchParams.get('title'));
                //Too much POST data could kill the connection
                //data 부분은 조각조각의 양을 수신할 때마다 callback함수를 호출.
               body=body+data;
              });
              request.on('end',function(){
              
               console.log(body);
               //querystring 모듈은 이제 legacy여서 URLSearchParams로 대체하여 사용한다.
               let params=new URLSearchParams(body);
               var title=params.get('title');
               var description=params.get('description');
               fs.writeFile(`data/${title}`,description,'utf-8',
               function(err){
                response.writeHead(302,{Location:`/?id=${title}`
                });
                response.end();
               })
               console.log(params.get('title'));
               console.log(params.get('description'));

               
              });
             

            }
            else if(pathname==='/update'){
              fs.readdir('./data',function(error,fileList){
                console.log(fileList);
                var filteredId=path.parse(title).base;
              fs.readFile(`data/${filteredId}`,'utf8',function(err,description){
                if(title===null){
                  title='Welcome';
                  //최상위 경로로 가면 title 변수가 welcome으로 바뀌고, template이 자동으로 실행된다.
                  description='Hello,Node.js';
                }
               
                var list=template.list(fileList);
                var html=template.html(title,list, 
                  `<form action="/process_update" method="post">
                  <input type="hidden" name="id" value="${title}">
                  <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                  <p>
                    <textarea name="description" placeholder="description">${description}</textarea>
                  </p>
                  <p>
                    <input type="submit">
                  </p>
                </form>
                `,  ` <a href="/create">create</a> <a href="/update?id=${title}">update</a>`
            );
                response.writeHead(200);
                response.end(html);
                //response.end안에 뭐가 들어가느냐에 따라 사용자에게 전송되는 코드가 다르다.
          
              //querystring의 값에 따라서 html 페이지 안의 내용을 제어할 수 있다.=> 동적인 웹페이지를 만들 수 있다.
              });
            })
        
            }
            else if(pathname==='/process_update'){
              var body='';
              request.on('data',function(data){

                console.log(myURL.searchParams.get('title'));
               body=body+data;
              });
              request.on('end',function(){
              
                console.log(body);
               
                let params=new URLSearchParams(body);
                var id=params.get('id');
                var title=params.get('title');
                var description=params.get('description');
              
                //file이름을 rename하고 내용을 수정하는데 rename함 수를 사용한다.
               fs.rename(`data/${id}`,`data/${title}`,function(){
                response.writeHead(302, {Location: `/?id=${title}`});
                response.end();
               });
                console.log(id);
                console.log(title);
                console.log(description);
 
                
               });
            }
            else if(pathname==='/delete_process'){
              var body='';
              request.on('data',function(data){

               body=body+data;
              });
              request.on('end',function(){
              
                console.log(body);
               
                let params=new URLSearchParams(body);
                var id=params.get('id');
                var filteredId=path.parse(id).base;
                //file을 삭제하기 위해 unlink함수를 사용한다.
               fs.unlink(`data/${filteredId}`,function(error){
                response.writeHead(302, {Location: `/`});
                response.end();
               });
               
                
               });
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
//요청에 대해 응답할 수 있도록 특정한 포트를 주시하고 있도록 하는 함수가 listen.