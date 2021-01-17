import {request} from '../request';
export function getdorm(college,className,isInstructor) {
    return request({
        url: '/checkdorm',
        method: 'POST',
        params:{
            college,
            className,
            isInstructor
        }
    })
}
export function findbytime(college,className,isInstructor,check_time,state,isread,currentPage,pageSize) {
    return request({
        url: '/findBytime',
        method: 'POST',
        params:{
            college,
            className,
            isInstructor,
            check_time,
            state,
            isread,
            currentPage,
            pageSize
        }
    })
}
export function changeread(checkTime,dormNum,feedbackDescribe,
    feedbackPicture,id,readIt,state,stuReadIt,
    unqualifiedDescribe,unqualifiedPicture,isInstructor){
    return request({
        url:'/changeRead',
        method:'POST',
        params:{
            checkTime,dormNum,feedbackDescribe,
    feedbackPicture,id,readIt,state,stuReadIt,
    unqualifiedDescribe,unqualifiedPicture,isInstructor
        }
    })
}

export function changestate(checkTime,dormNum,feedbackDescribe,
    feedbackPicture,id,readIt,state,stuReadIt,
    unqualifiedDescribe,unqualifiedPicture){
    return request({
        url:'/changeState',
        method:'POST',
        params:{
            checkTime,dormNum,feedbackDescribe,
    feedbackPicture,id,readIt,state,stuReadIt,
    unqualifiedDescribe,unqualifiedPicture
        }
    })
}

export function changeFkRead(checkTime,dormNum,feedbackDescribe,
    feedbackPicture,id,readIt,state,stuReadIt,
    unqualifiedDescribe,unqualifiedPicture,isInstructor){
    return request({
        url:'/changeFbRead',
        method:'POST',
        params:{
        checkTime,dormNum,feedbackDescribe,
    feedbackPicture,id,readIt,state,stuReadIt,
    unqualifiedDescribe,unqualifiedPicture,isInstructor
        }
    })
}

