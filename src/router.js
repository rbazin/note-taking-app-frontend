// vue router

import { createRouter, createWebHistory } from 'vue-router'

import LandingPage from './vues/LandingPage.vue'

const routes = [
    {
        path: '/', name: 'LandingPage', component: LandingPage
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router