import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import GeneratedFile from '../views/GeneratedFile'
import DashboardLayout from '../layouts/DashboardLayout'
import PreviewLayout from '../layouts/PreviewLayout'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    children: [
      {
        path: '/',
        name: 'Home',
        component: Home
      }
    ]
  },
  {
    path: '/generated-file/:id',
    component: PreviewLayout,
    children: [
      {
        path: '/',
        name: 'GeneratedFile',
        component: GeneratedFile,
        props: true
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
