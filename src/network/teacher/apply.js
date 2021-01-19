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

// 同意请假
export function agreeapply(position,id,stuNum,username,className,college,phone,headmaster,headmasterPhone,whereabouts,
    parentPhone,reason,specificReasons,picture,timeOffStart,timeOffEnd,leavedays) {
    return request({
        url: '/leave/teaagreeapply',
        method: 'POST',
        params:{
            position,id,
            stuNum,username,className,college,phone,headmaster,headmasterPhone,whereabouts,
            parentPhone,reason,specificReasons,picture,timeOffStart,timeOffEnd,leavedays
        }
    })
}
// 不同意请假

export function disagreeapply(position,id,stuNum,username,className,college,phone,headmaster,headmasterPhone,whereabouts,
    parentPhone,reason,specificReasons,picture,timeOffStart,timeOffEnd,leavedays) {
    return request({
        url: '/leave/teaunagreeapply',
        method: 'POST',
        params:{
            position,id,
            stuNum,username,className,college,phone,headmaster,headmasterPhone,whereabouts,
            parentPhone,reason,specificReasons,picture,timeOffStart,timeOffEnd,leavedays
        }
    })
}

// 获取未通过
export function getfailedapply(position,college,className,currentPage,pageSize) {
    return request({
        url: '/leave/teagetunpass',
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
// 获取未消假
export function getnadopt(position,college,className,currentPage,pageSize) {
    return request({
        url: '/leave/teagetuncancel',
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

// 不同意销假
export function disagreeadopt(id,stuNum,username,className,college,phone,headmaster,headmasterPhone,
    whereabouts,parentPhone,reason,specificReasons,picture,timeOffStart,timeOffEnd,leavedays) {
    return request({
        url: '/leave/teaagreeuncancel',
        method: 'POST',
        params:{
            id,stuNum,username,className,college,phone,headmaster,headmasterPhone,
            whereabouts,parentPhone,reason,specificReasons,picture,timeOffStart,timeOffEnd,leavedays
        }
    })
}
// 同意销假
export function agreeadopt(id,stuNum,username,className,college,phone,headmaster,headmasterPhone,
    whereabouts,parentPhone,reason,specificReasons,picture,timeOffStart,timeOffEnd,leavedays) {
    return request({
        url: '/leave/teaagreecancel',
        method: 'POST',
        params:{
            id,stuNum,username,className,college,phone,headmaster,headmasterPhone,
            whereabouts,parentPhone,reason,specificReasons,picture,timeOffStart,timeOffEnd,leavedays
        }
    })
}

// 获取已销假
export function getadopt(position,college,className,currentPage,pageSize) {
    return request({
        url: '/leave/teagetcancel',
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

