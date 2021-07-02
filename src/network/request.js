import axios from 'axios'
import Router from '@/router/index' 
import { Message } from 'element-ui';
export function request(config) {
    const intance = axios.create({
        baseURL:'https://cxcy.gmu.cn/score',
        withCredentials:true,
        timeout: 10000
    }) 
    // intance.defaults.
    intance.interceptors.request.use(
        config => { 
            // config.headers.Cookie = `JSESSIONID=${window.sessionStorage.getItem('session')}`
            // config.headers.Authorization = window.sessionStorage.getItem('session')  
        //    cookie.set(`JSESSIONID=${window.sessionStorage.getItem('session')}`)
            return config
        },
        error => {
            console.log(error)
        })
    intance.interceptors.response.use(
        response => {
            if(response.data.message == '尚未登录,请登录!' || response.data.code == 403){
                     Message.error("尚未登录,请重新登录") 
                     Router.push('/login')
                }
            return response.data
        },
        error=>{
            // Message.error("出错啦！！！请重新登录")
            // Router.push('/login')
            console.log(error);
        })
        return intance(config)
}