// vue router

import { createRouter, createWebHistory } from 'vue-router'

import LandingPage from './vues/LandingPage.vue'
import NotePage from './vues/NotePage.vue'

const routes = [
    {
        path: '/', name: 'LandingPage', component: LandingPage
    },
    {
        path: '/note', name: 'NotePage', component: NotePage
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router