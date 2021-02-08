import { request } from '../request';
export function submitfiveone(name,stuNum,className,college,headmasterName,uploadTime,workAddress,semester){
    return request({
        url:'/fiveone/send',
        method:'POST',
        params:{
            name,stuNum,className,college,headmasterName,uploadTime,workAddress,semester
        }
    })
}