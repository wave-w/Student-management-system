import {
    request
} from '../request';
export function getteaInfo(teanum) {
    return request({
        url: '/teaInfo',
        method: 'POST',
        params:{
            teanum
        }
    })
}