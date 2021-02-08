import { request } from '../request';
export function getfiveone(position,college,className,semester,workAddress,currentPage,pageSize){
    return request({
        url:'/fiveone/teafindfiveone',
        method:'POST',
        params:{
            position,college,className,semester,workAddress,currentPage,pageSize
        }
    })
}