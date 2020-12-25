import {request} from '../request'
export function getsinfor(stunum){
    return request({
        url:'/stuInfo',
        method:'POST',
        params:{
            stunum
        }
    })
}