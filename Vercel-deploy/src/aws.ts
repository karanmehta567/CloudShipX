import {S3} from 'aws-sdk';
import path from 'path'
import fs from 'fs'
require('dotenv').config();
const s3=new S3({
    accessKeyId:process.env.ACCESS_KEY,
    secretAccessKey:process.env.SECRET_ACCESS_KEY
})
export async function download3folder(prefix:string){
    const allFiles=await s3.listObjectsV2({
        Bucket:'vercel-type-project',
        Prefix:prefix
    }).promise()
    console.log('allfiles',allFiles)
    // [output/djhfuahf/index.html],[output/djhqwuh/style.css] array of strings
    const allPromises=allFiles.Contents?.map(async({Key})=>{
        return new Promise(async(resolve)=>{
            if(!Key){
                resolve("")
                console.log('no key')
                return;
            }
            const normalizedKey = Key.replace(/\\/g, '/');
            const finaloutputpath = path.join(__dirname, normalizedKey);
            console.log('finaloutputpath',finaloutputpath)
            const outputfile=fs.createWriteStream(finaloutputpath)
            console.log('outputfile',outputfile)
            const dirName=path.dirname(finaloutputpath)
            console.log('dirname',dirName)
            if(!fs.existsSync(dirName)){
                fs.mkdirSync(dirName,{recursive:true})
            }
            s3.getObject({
                Bucket:"vercel-type-project",
                Key
            }).createReadStream().pipe(outputfile).on('finish',()=>{
                resolve("")
            })
        }) 
    })|| []
    console.log(
        'awaiting'
    )
    await Promise.all((allPromises || []).filter(x => x !== undefined))
}
export async function copyFinalDist(id:string){
    const folderpath=path.join(__dirname,`output/${id}/dist`);
    const allFiles=getAllfileandFolder(folderpath)
    // const fileContent=allFiles.forEach(file=>{
    //     const relativePath = file.slice(folderpath.length + 1).replace(/\\/g, '/');
    //     uploadFile(`dist/${id}/${relativePath}`, file);
    // })
    // console.log('fileContent',fileContent)
    for (const file of allFiles) {
    const relativePath = file.slice(folderpath.length + 1).replace(/\\/g, '/');
    await uploadFile(`dist/${id}/${relativePath}`, file);
}
}
export const getAllfileandFolder=(folderpath:string)=>{
    let response:string[]=[];
    const files=fs.readdirSync(folderpath);
    files.forEach((file)=>{
        const fullfilepath=path.join(folderpath,file)
        if(fs.statSync(fullfilepath).isDirectory()){
            response=response.concat(getAllfileandFolder(fullfilepath))
        }else{
            response.push(fullfilepath)
}
    })
    return response;
}
const uploadFile=async(fileName:string,localFilePath:string)=>{
    const fileContent=fs.readFileSync(localFilePath);
    const response=await s3.upload({
        Body:fileContent,
        Bucket:'vercel-type-project',
        Key:fileName
    }).promise()
    console.log('response',response)
}