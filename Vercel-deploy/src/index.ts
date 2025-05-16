import {createClient,commandOptions} from "redis";
import { copyFinalDist, download3folder } from "./aws";
import { buildProject } from "./utils";

const subsriber=createClient();
subsriber.connect()
 //localhost
const publisher=createClient();
publisher.connect() 
async function main(){
    while(1){
            const response=await subsriber.brPop(
                commandOptions({
                    isolated:true
                }),
                'build-queue',
                10
            )
            //@ts-ignore
            const id=response?.element;
            console.log(id);
            if (id) {
                await download3folder(`output/${id}`);
                console.log('downloaded');
                await buildProject(id);
                await copyFinalDist(id);
                publisher.hSet('status',id,'deployed')
            } else {
                console.error('Invalid id received:', id);
            }
        }
}
main()
