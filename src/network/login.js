import { request } from './request';
export function Login(username,password,rememberme){
    return request({
        url : '/login/login',
        method:'POST',
        params: {
            username,
            password,
            rememberme
        }
    })
}
export function logout(){
    return request({
        url : '/logout',
        method:'POST'
    })
}