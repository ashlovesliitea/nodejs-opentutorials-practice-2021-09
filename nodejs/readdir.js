const testfolder='./data';
const fs=require('fs');


fs.readdir(testfolder,(err,filelist)=>{
    //data밑의 fileliest의 목록이 배열로 나온다.
    console.log(filelist);
})