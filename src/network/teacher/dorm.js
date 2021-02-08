import {request} from '../request';
export function getdorm(college,className,position) {
    return request({
        url: '/checkdorm',
        method: 'POST',
        params:{
            college,
            className,
            position
        }
    })
}
export function findbytime(college,className,position,check_time,state,isread,currentPage,pageSize) {
    return request({
        url: '/findBytime',
        method: 'POST',
        params:{
            college,
            className,
            position,
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
    unqualifiedDescribe,unqualifiedPicture,position){
    return request({
        url:'/changeRead',
        method:'POST',
        params:{
            checkTime,dormNum,feedbackDescribe,
    feedbackPicture,id,readIt,state,stuReadIt,
    unqualifiedDescribe,unqualifiedPicture,position
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
    unqualifiedDescribe,unqualifiedPicture,position){
    return request({
        url:'/changeFbRead',
        method:'POST',
        params:{
        checkTime,dormNum,feedbackDescribe,
    feedbackPicture,id,readIt,state,stuReadIt,
    unqualifiedDescribe,unqualifiedPicture,position
        }
    })
}

export function allread(college,className,position) {
    return request({
        url: '/allRead',
        method: 'POST',
        params:{
            college,
            className,
            position
        }
    })
}

