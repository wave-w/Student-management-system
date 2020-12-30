import { request } from '../request';
export function getsdorm(stunum){
    return request({
        url:'/stuDorm',
        method:'POST',
        params:{
            stunum
        }
    })
}
export function checkdorm(dormNum,check_time,state,currentPage,pageSize){
    return request({
        url:'/findDorm',
        method:'POST',
        params:{
            dormNum,check_time,state,currentPage,pageSize
        }
    })
}

export function feedteacher(checkTime,dormNum,feedbackDescribe,
    feedbackPicture,id,readIt,state,stuReadIt,
    unqualifiedDescribe,unqualifiedPicture){
    return request({
        url:'/sendfeedback',
        method:'POST',
        params:{
            checkTime,dormNum,feedbackDescribe,
            feedbackPicture,id,readIt,state,stuReadIt,
            unqualifiedDescribe,unqualifiedPicture
        }
    })
}

export function changesread(checkTime,dormNum,feedbackDescribe,
    feedbackPicture,id,readIt,state,stuReadIt,
    unqualifiedDescribe,unqualifiedPicture){
    return request({
        url:'/changeStateStu',
        method:'POST',
        params:{
            checkTime,dormNum,feedbackDescribe,
            feedbackPicture,id,readIt,state,stuReadIt,
            unqualifiedDescribe,unqualifiedPicture
        }
    })
}

export function uploadimg(file){
    return request({
        url:'/tupian',
        method:'POST',
        data:{
           file
        }
    })
}

