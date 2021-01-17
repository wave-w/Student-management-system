import {request} from '../request';
// 分页
export function changepage(position,college,className,currentPage,pageSize) {
    return request({
        url: '/leave/teagetapplytopage',
        method: 'POST',
        params:{
            position,
            college,
            className,
            currentPage,
            pageSize
        }
    })
}