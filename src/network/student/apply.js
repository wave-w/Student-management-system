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

//  获取申请
export function getapply(stuNum,username){
     return request({
         url:'/leave/stugetapply',
         method:'POST',
         params:{
            stuNum,username
         }
     })
 }