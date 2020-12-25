import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import Login from '@/views/Login'
import StudentHome from '@/views/student/StudentHome'
// home目录下
// 个人信息
import Information from '@/views/student/information/index'
// 请假
import Apply from '@/views/student/application/apply'
import Failed from '@/views/student/application/failed'
import Adopt from '@/views/student/application/adopt'
import Nadopt from '@/views/student/application/nadopt'

// 三个文明
import Dorm from '@/views/student/civilization/dorm'
import Class from '@/views/student/civilization/class'

// 五个一
import Fiveone from '@/views/student/fiveone/index'

// 志愿活动
import Volunteer from '@/views/student/volunteer/index'

// 加减分
import Bpoints from '@/views/student/sfraction/sbpoints'
import Mpoints from '@/views/student/sfraction/smpoints'

// 老师页面
import Thome from '@/views/teacher/teacherhome'
import Welcome from '@/views/teacher/welcome'
// 请假
import TApply from '@/views/teacher/application/apply'
import TFailed from '@/views/teacher/application/failed'
import TAdopt from '@/views/teacher/application/adopt'
import TNadopt from '@/views/teacher/application/nadopt'

// 三个文明
import TDorm from '@/views/teacher/civilization/dorm'
import TClass from '@/views/teacher/civilization/class'

// 五个一
import TFiveone from '@/views/teacher/fiveone/index'

// 志愿活动
import TVolunteer from '@/views/teacher/volunteer/index'

// 加减分
import TBpoints from '@/views/teacher/sfraction/sbpoints'
import TMpoints from '@/views/teacher/sfraction/smpoints'
const routes = [{
    path: '/',
    component: Login
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/shome',
    component: StudentHome,
    children: [{
        path: '/',
        component: Information
      },
      {
        path: '/sinfor',
        name: 'Information',
        component: Information
      },
      //请假
      {
        path: '/slave',
        name: 'Apply',
        component: Apply
      },
      {
        path: '/failed',
        name: 'Failed',
        component: Failed
      },
      {
        path: '/adopt',
        name: 'Adopt',
        component: Adopt
      },
      {
        path: '/nadopt',
        name: 'Nadopt',
        component: Nadopt
      },
      // 三个文明
      {
        path: '/sdormcivi',
        name: 'Dorm',
        component: Dorm
      },
      {
        path: '/sclasscivi',
        name: 'Class',
        component: Class
      },
      // 五个一
      {
        path: '/sfone',
        name: 'Fiveone',
        component: Fiveone
      },
      //志愿活动 Volunteer 
      {
        path: '/sactiv',
        name: 'Volunteer',
        component: Volunteer
      },
      // 加减分 sbpoints
      {
        path: '/sbpoints',
        name: 'sbpoints',
        component: Bpoints
      },
      {
        path: '/smpoints',
        name: 'smpoints',
        component: Mpoints
      }
    ]
  },

  // 老师页面跳转
  {
    path: '/thome',
    component: Thome,
    children: [{
      path: '/',
      component: Welcome
    },
    {
      path: '/welcome',
      name: 'Welcome',
      component: Welcome
    },
    //请假
    {
      path: '/tslave',
      name: 'TApply',
      component: TApply
    },
    {
      path: '/tfailed',
      name: 'TFailed',
      component: TFailed
    },
    {
      path: '/tadopt',
      name: 'TAdopt',
      component: TAdopt
    },
    {
      path: '/Tnadopt',
      name: 'TNadopt',
      component: TNadopt
    },
    // 三个文明
    {
      path: '/tsdormcivi',
      name: 'TDorm',
      component: TDorm
    },
    {
      path: '/tsclasscivi',
      name: 'TClass',
      component: TClass
    },
    // 五个一
    {
      path: '/Tsfone',
      name: 'tFiveone',
      component: TFiveone
    },
    //志愿活动 Volunteer 
    {
      path: '/tsactiv',
      name: 'TVolunteer',
      component: TVolunteer
    },
    // 加减分 sbpoints
    {
      path: '/tsbpoints',
      name: 'Tsbpoints',
      component: TBpoints
    },
    {
      path: '/tsmpoints',
      name: 'Tsmpoints',
      component: TMpoints
    }
  ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// router.beforeEach((to, from, next) => {
//   let isAuthenticated = false
//   if (window.sessionStorage.getItem('token') != null) {
//     isAuthenticated = window.sessionStorage.getItem('token')
//     window.sessionStorage.clear()
//   }
//   if (to.name !== 'Login' && !isAuthenticated){ 
//     // this.$router.push('/login');
//     next({name:Login})
//   }
//   else{ next() }
// })

export default router
