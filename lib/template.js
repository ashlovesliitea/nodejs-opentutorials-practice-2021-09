
//객체를 이용하여 refactoring할 수 있다. 값이 훨씬 깔끔해짐.
var template={
    html: function(title,list,body,control){
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
                        ${control}
                        ${body}
                      </body>
                      </html>
                `
    
    },
    list:function (fileList){
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
    }
    
    module.exports=template;