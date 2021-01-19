import { request } from '../request';
 export function sendapply(stuNum,username,className,college,phone,headmaster,headmasterPhone,
    whereabouts,parentPhone,reason,specificReasons,picture,timeOffStart,timeOffEnd,leavedays){
     return request({
         url:'/leave/stuapply',
         method:'POST',
         params:{
            stuNum,username,className,college,phone,headmaster,headmasterPhone,whereabouts,
            parentPhone,reason,specificReasons,picture,timeOffStart,timeOffEnd,leavedays
         }
     })
 }

//  获取申请中
export function getapply(stuNum,username){
     return request({
         url:'/leave/stugetapply',
         method:'POST',
         params:{
            stuNum,username
         }
     })
 }

//  获取未通过
export function getfailedapply(stuNum,username){
    return request({
        url:'/leave/stugetunpass',
        method:'POST',
        params:{
           stuNum,username
        }
    })
}

// 获取未消假
export function getnadoptapply(stuNum,username){
    return request({
        url:'/leave/stugetuncancel',
        method:'POST',
        params:{
           stuNum,username
        }
    })
}

// 申请销假

export function adoptapply(id,cancelExplain,cancelPicture,stuNum,username,className,college,phone,headmaster,headmasterPhone,
    whereabouts,parentPhone,reason,specificReasons,picture,timeOffStart,timeOffEnd,leavedays){
    return request({
        url:'/leave/stutocancel',
        method:'POST',
        params:{
            id,cancelExplain,cancelPicture,stuNum,username,className,college,phone,headmaster,headmasterPhone,
            whereabouts,parentPhone,reason,specificReasons,picture,timeOffStart,timeOffEnd,leavedays
        }
    })
}

// 获取已销假
export function getndoptapply(stuNum,username){
    return request({
        url:'/leave/stugetcancel',
        method:'POST',
        params:{
           stuNum,username
        }
    })
}