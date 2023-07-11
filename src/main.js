import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

const pinia = createPinia()

// Import bluma customizations
require('@/assets/main.scss');

// Import fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFolder, faFilePen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faFolder, faFilePen)


createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
    .use(router)
    .use(pinia)
    .mount('#app')
