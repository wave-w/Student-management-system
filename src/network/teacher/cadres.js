import { request } from '../request';
export function getcadrescount(college,currentPage,pageSize){
    return request({
        url:'/getAllStucadres',
        method:'GET',
        params:{
            college,currentPage,pageSize
        }
    })
}
export function addcadrescount(username,name,college,password){
    return request({
        url:'/addStucadres',
        method:'POST',
        params:{
            username,name,college,password
        }
    })
}

export function deletecadrescount(ids){
    return request({
        url:'/deleteStucadres',
        method:'DELETE',
        params:{
            ids
        }
    })
}