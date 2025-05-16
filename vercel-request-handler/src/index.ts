import express from 'express';
const app=express();
require('dotenv').config();
import { S3 } from 'aws-sdk'; 
const s3=new S3({
    accessKeyId:process.env.ACCESS_KEY,
    secretAccessKey:process.env.SECRET_ACCESS_KEY
})
app.get('/*',async(req,res)=>{
    const host=req.hostname;
    console.log(host) //=>[id.vercel.com]
    //=>split it into 3 
    const id=host.split(".")[0] //=>[id,vercel,com]
    console.log('Id',id)
    const reqFile = req.path;
    console.log('reqFile',reqFile)
    try {
     const contents=await s3.getObject({
        Bucket:'vercel-type-project',
        Key:`dist/${id}${reqFile}`
    }).promise()
    const type=reqFile.endsWith('html')?"text/html":reqFile.endsWith('css')?"text/css":"application/javascript"
    res.set('Content-type',type)
    res.send(contents.Body)   
    } catch (error) {
        console.log(error)
    }
})

app.listen(3001)